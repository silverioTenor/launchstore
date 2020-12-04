import { hash } from 'bcryptjs';
import fs from 'fs';

import Address from '../models/Address';
import User from '../models/User';
import Product from '../models/Product';
import File from './../models/File';
import FilesManager from '../models/FilesManager';

import { formatCpfCnpj, formatCep } from '../../lib/utils';

const UserController = {
  registerForm(req, res) {
    if (req.query.status == 400) {
      return res.render("users/register", {
        message: "Erro inesperado!",
        type: "error",
        formFull: false
      });
    }
  },
  async post(req, res) {
    try {
      let { name, email, password, cpf_cnpj } = req.body;

      password = await hash(password, 8);
      cpf_cnpj = cpf_cnpj.replace(/\D/g, "");

      const values = { name, email, password, cpf_cnpj };

      const userDB = new User();
      await userDB.create(values);

      return res.redirect("/users/login");

    } catch (error) {
      console.error(error);

      return res.redirect("users/register?status=400");
    }
  },
  async show(req, res) {
    try {
      let { user, addr } = req;

      user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj);
      if (addr) addr.cep = formatCep(addr.cep);

      return res.render("users/index", { user, addr, formFull: true });

    } catch (error) {
      console.error(error);

      return res.render("users/index", {
        message: "Erro inesperado!",
        type: "error",
        formFull: true
      })
    }
  },
  async update(req, res) {
    const { userID: id } = req.session.user;
    
    try {
      const addrDB = new Address();
      await addrDB.update(req.addr.val, req.addr.fields);
      
      const userDB = new User();
      await userDB.update(req.user.val, req.user.fields);

      const fileDB = new File();
      await fileDB.update(req.updatedFiles);

      return res.redirect(`users/show/${id}`);

    } catch (error) {
      console.error(`Failed to save. error: ${error}`);

      return res.render("users/index", {
        message: "Desculpa! Não foi possível completar a operação.",
        type: "error",
        formFull: true
      });
    }
  },
  async delete(req, res) {
    try {
      async function removeImage(values) {
        const results = await FilesManager.get(values);
        const files = results.path;

        files.forEach(file => {
          if (fs.existsSync(file)) fs.unlinkSync(file);
        });
      }

      // Pegar as imagens do Usuário
      let column = "user_id";
      const userID = req.session.user.userID;
      let values = { id: userID, column };

      await removeImage(values);

      // Pegar as imagens dos produtos
      column = "product_id";
      const products = await Product.getAllOfUsers(userID);

      products.forEach(async product => {
        values = { id: product.id, column };
        await removeImage(values);
      });

      // Busca o ID da tabela Address para então remov
      const id = req.session.user.userID;
      const data = await User.get(id);
      const addr_id = data.address_id;
      await Address.remove(addr_id);

      req.session.destroy();

      return res.render("session/login", {
        message: "Conta removida com sucesso!",
        type: "success"
      });

    } catch (error) {
      console.error(`Failed to Delete. error: ${error}`);

      return res.render("users/index", {
        message: "Desculpa! Não foi possível completar a operação.",
        type: "error",
        formFull: true
      });
    }
  }
}

export default UserController;