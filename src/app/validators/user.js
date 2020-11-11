import { compare } from "bcryptjs";
import fs from 'fs';

import User from "../models/User";
import FilesManager from '../models/FilesManager';
import Address from './../models/Address';

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

    const user = await User.getBy({
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
    const { userID: id } = req.session;

    try {
      const filters = { where: { id } };
      user = await User.getBy(filters);

    } catch (error) {
      console.error(`Search user failure. error: ${error}`);

      return res.render("session/login", {
        message: "Usuário não encontrado!",
        type: "error"
      });
    }

    let addr = "";

    if (user.address_id && user.address_id != "" || user.address_id != undefined) {
      try {
        addr = await Address.get(user.address_id);
        req.addr = addr;

      } catch (error) {
        console.error(`Search addr failure. error: ${error}`);
      }
    }

    const column = "user_id";
    const values = { id, column };
    let photo = {};

    try {
      photo = await FilesManager.get(values);

      if (photo !== "undefined" || Object.keys(photo.path).length > 0) {
        user.photo = {
          id: photo.id,
          path: `${req.protocol}://${req.headers.host}${photo.path}`.replace("public", "")
        }
      }

    } catch (error) {
      console.error(`oparation failure. error: ${error}`)
    }

    req.user = user;

    next();
  },
  async update(req, res, next) {
    const fillAllFields = Needed.checkAllFields(req.body);

    if (fillAllFields) {
      return res.render("users/index", fillAllFields);
    }

    const { userID: id } = req.session;
    let { password } = req.body;

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
      user = await User.getBy({ where: { id } });

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

    req.user = { name, email, cpf_cnpj };

    // Validação da foto
    let photo = [];
    const column = "user_id";
    let values = { id, column };
    let file = {};
    
    try {
      file = await FilesManager.get(values);

    } catch (error) {
      console.error(`Operation failure. error: ${error}`);
    }

    if (file !== "undefined" || Object.keys(file).length > 0) {
      if (req.body.removedPhotos) {
        let removedPhotos = req.body.removedPhotos.split(",");
        const lastIndex = removedPhotos.length - 1;

        removedPhotos.splice(lastIndex, 1);
        removedPhotos = removedPhotos.map(photo => Number(photo));

        if (file && file != "" || file != undefined) {
          if (fs.existsSync(file.path[0])) {
            fs.unlinkSync(file.path[0]);

            values = [file.id, photo];
            await FilesManager.edit(values);
          }
        }
      }

      try {
        if (req.files && req.files.length > 0) {
          photo.push(req.files[0].path);

          if (!file || file == "" || file == undefined) {
            let fm_id = await FilesManager.save(values);

            values = [photo, fm_id];
            await FilesManager.saveInFiles(values);

          } else {
            let fm_id = file.id;
            values = [fm_id, photo];

            await FilesManager.edit(values);
          }
        }

      } catch (error) {
        console.error(`Unexpected error: ${error}`);
      }
    }

    // Validação do Endereço
    let addr = "";

    try {
      if (user.address_id) addr = await Address.get(user.address_id);

    } catch (error) {
      console.error(`Operation failure. error: ${error}`);
    }

    let { cep, street, complement, district, locale, uf } = req.body;
    cep = cep.replace(/\D/g, "");
    const state = locale;

    try {
      if (!addr || addr == "" || addr == undefined) {
        values = [cep, street, complement, district, state, uf];
        const result = await Address.save(values);
        req.user.address_id = result;

      } else {
        values = [addr.id, cep, street, complement, district, state, uf];
        req.addr = values;
      }

    } catch (error) {
      console.error(`Operation failure. error: ${error}`);
    }

    next();
  }
}

export default Validators;