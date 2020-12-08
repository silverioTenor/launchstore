import { compare } from "bcryptjs";

import User from "../models/User";
import Address from './../models/Address';

import { getImages, prepareToUpdate } from '../services/procedures';

const Validators = {
  checkAllFields(body) {
    const keys = Object.keys(body);

    for (const key of keys) {
      if (body[key] == "" && body[key] == "removedPhotos") return {
        user: body,
        message: `Preencha todos os campos!`,
        type: "error",
        formFull: true
      };
    }
  },
  async post(req, res, next) {
    const fillAllFields = Validators.checkAllFields(req.body);

    if (fillAllFields) {
      return res.render("users/register", fillAllFields);
    }

    let { email, cpf_cnpj, password, passwordRepeat } = req.body;

    cpf_cnpj = cpf_cnpj.replace(/\D/g, "");

    const userDB = new User();
    const user = await userDB.getBy({
      where: { email },
      or: { cpf_cnpj }
    });

    if (user) return res.render("users/register", {
      user: req.body,
      message: "Usuário já cadastrado!",
      type: "error"
    });

    if (password != passwordRepeat) return res.render("users/register", {
      user: req.body,
      message: "As senhas não coincidem!",
      type: "error"
    });

    next();
  },
  async show(req, res, next) {
    let user = {};
    const { userID: id } = req.session.user;

    try {
      const userDB = new User();
      user = await userDB.getBy({ where: { id } });

    } catch (error) {
      console.error(`Search user failure. error: ${error}`);

      return res.render("session/login", {
        message: "Usuário não encontrado!",
        type: "error"
      });
    }

    let addr = "";
    let values = {};

    if (user && user.address_id) {
      try {
        values = { id: user.address_id, column: "id" };

        const addrDB = new Address();
        addr = await addrDB.get(values);

        req.addr = addr[0];

      } catch (error) {
        console.error(`Search addr failure. error: ${error}`);
      }
    }

    try {
      values = { id, column: "user_id" };

      const photo = await getImages(values);

      if (photo && photo.path) {
        req.session.user.photo = photo[0].path;
      }

      user.photo = photo[0];

      req.user = user;

      next();

    } catch (error) {
      console.error(`oparation failure. error: ${error}`)
    }
  },
  async update(req, res, next) {
    const fillAllFields = Validators.checkAllFields(req.body);

    if (fillAllFields) {
      return res.render("users/index", fillAllFields);
    }

    // Validação do usuário
    async function userValidation(id, password) {
      if (!password) {
        return res.render("users/index", {
          message: "Coloque sua senha para atualizar.",
          type: "warning",
          formFull: true
        });
      }

      let user = "";
      let passed = "";

      try {
        const userDB = new User();
        user = await userDB.getBy({ where: { id } });

      } catch (error) {
        console.error(`Operation failure. error: ${error}`);
      }

      if (user && user != "" || user != undefined) {
        passed = await compare(password, user.password);

        if (!passed || passed == "") {
          return res.render("users/index", {
            message: "Senha incorreta",
            type: "error",
            formFull: true
          });
        }
      }

      let { name, email, cpf_cnpj } = req.body;

      cpf_cnpj = cpf_cnpj.replace(/\D/g, "");

      req.session.user.name = name.split(" ")[0];

      req.user = {
        val: { id, column: "id" },
        fields: { name, email, cpf_cnpj }
      };

      return user;
    }

    // Validação do Endereço
    async function addressValidation(user) {
      let addr = "";
      const addrDB = new Address();

      try {
        if (user.address_id) addr = await addrDB.get({ id: user.address_id, column: "id" });

      } catch (error) {
        console.error(`Operation failure. error: ${error}`);
      }

      let { cep, street, complement, district, locale, uf } = req.body;
      cep = cep.replace(/\D/g, "");
      const state = locale;

      try {
        if (!addr || addr == "" || addr == undefined) {
          const addrID = await addrDB.create({ cep, street, complement, district, state, uf });
          req.user.address_id = addrID;

        } else {
          req.addr = {
            val: { id: addr.id, column: "id" },
            fields: { cep, street, complement, district, state, uf }
          };
        }

      } catch (error) {
        console.error(`Operation failure. error: ${error}`);
      }
    }

    try {
      const { userID: id } = req.session.user;
      const { password } = req.body;

      const user = await userValidation(id, password);

      await addressValidation(user);

      // Validação da foto
      const values = { id: Number(req.body.id), column: "user_id" };
      req.updatedFiles = await prepareToUpdate(req.body, req.files, values);

      // Verifica se tem foto e então atribui ela à sessão
      if (req.updatedFiles?.values) {
        req.session.user.photo = { path: req.updatedFiles.values[1][0].replace("public", "") };
      }

      next();

    } catch (error) {
      console.error(`Unexpected error in UPDATE VALIDATORS. error: ${error}`);
    }
  }
}

export default Validators;