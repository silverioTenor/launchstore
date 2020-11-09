import { hash } from 'bcryptjs';

import User from './../../models/User';
import FilesManager from './../../models/FilesManager';
import Address from './../../models/Address';

import utils from '../../../lib/utils';

const { formatCpfCnpj, formatCep } = utils;

const UserController = {
  registerForm(req, res) {
    return res.render("users/register", { formFull: false });
  },
  async post(req, res) {
    try {
      let { name, email, password, cpf_cnpj } = req.body;

      password = await hash(password, 8);
      cpf_cnpj = cpf_cnpj.replace(/\D/g, "");

      const values = [name, email, password, cpf_cnpj];

      const userID = await User.save(values);
      req.session.userID = userID;

      return res.redirect(`/users/show/${userID}`);

    } catch (error) {
      console.error(error);

      return res.render("users/register", {
        message: "Erro inesperado!",
        type: "error"
      });
    }
  },
  async show(req, res) {
    try {
      const { user } = req;

      user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj);
      user.address.cep = formatCep(user.address.cep);

      return res.render("users/index", { user, formFull: true });

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
    const { userID: id } = req.session;
    let { user, saveFile, address } = req;

    try {
      await Address.edit(address);
      await User.edit(id, user);
      await FilesManager.edit(saveFile);

      return res.render("users/index", {
        message: "Dados atualizados com sucesso!",
        type: "success",
        formFull: true
      });
        
    } catch (error) {
      console.error(`Failed to save. error: ${error}`);

      return res.render("users/register", {
        message: "Desculpa! Não foi possível completar a operação.",
        type: "error",
        formFull: true
      });
    }
  }
}

export default UserController;