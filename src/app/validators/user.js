import { compare } from "bcryptjs";

import User from "../models/User";
import Address from './../models/Address';

import factory from '../services/factory'
import { removeImages } from '../../lib/utils';

const Needed = {
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
}

const Validators = {
  async post(req, res, next) {
    const fillAllFields = Needed.checkAllFields(req.body);

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

    if (user && user.address_id) {
      try {
        const values = { id: user.address_id, column: "id" };

        const addrDB = new Address();
        addr = await addrDB.get(values);

        req.addr = addr;

      } catch (error) {
        console.error(`Search addr failure. error: ${error}`);
      }
    }

    try {
      const values = { id, column: "user_id" };

      user.photo = await factory.getImages(values);
      req.session.user.photo = user.photo.path;

      req.user = user;

      next();

    } catch (error) {
      console.error(`oparation failure. error: ${error}`)
    }
  },
  async update(req, res, next) {
    const fillAllFields = Needed.checkAllFields(req.body);

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

      req.user = { name, email, cpf_cnpj };

      return user;
    }

    // Validação da foto
    async function fileValidation(id) {
      try {
        let values = { id, column: "user_id" };

        if (req.body.removedPhotos) {
          const files = await factory.getImages(values);

          if (files && files.path) {
            const updatedPhotos = removeImages(req.body.removedPhotos, files.path);

            values = { id: files.id, updatedPhotos };
            req.updateFiles = values;
          }
        }

        if (req.files && req.files.length > 0 && req.files[0].path) {
          let images = [];

          req.files.forEach(file => images.push(file.path));

          if (req.updateFiles) {
            images = [...images, ...req.updateFiles];
            req.fileSave = { images, values };

          } else {
            req.fileSave = { images, values };
          }
        }

      } catch (error) {
        console.error(`Operation failure. error: ${error}`);
      }
    }

    // Validação do Endereço
    async function addressValidation(user) {
      let addr = "";
      const addrDB = new Address();

      try {
        if (user.address_id) addr = await addrDB.get(user.address_id);

      } catch (error) {
        console.error(`Operation failure. error: ${error}`);
      }

      let { cep, street, complement, district, locale, uf } = req.body;
      cep = cep.replace(/\D/g, "");
      const state = locale;

      try {
        if (!addr || addr == "" || addr == undefined) {
          values = [cep, street, complement, district, state, uf];
          const result = await addrDB.save(values);
          req.user.address_id = result;

        } else {
          values = { cep, street, complement, district, state, uf };
          req.addr = { id: addr.id, values };
        }

      } catch (error) {
        console.error(`Operation failure. error: ${error}`);
      }
    }

    const { userID: id } = req.session.user;
    const { password } = req.body;

    const user = await userValidation(id, password);
    await fileValidation(id);
    await addressValidation(user);

    next();
  }
}

export default Validators;