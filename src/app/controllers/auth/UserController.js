import { hash } from 'bcryptjs';
import User from './../../models/User';

import utils from '../../../lib/utils';
const { formatCpfCnpj } = utils;

const UserController = {
  registerForm(req, res) {
    return res.render("users/register", { formFull: false });
  },
  async post(req, res) {
    let { name, email, password, cpf_cnpj } = req.body;

    password = await hash(password, 8);
    cpf_cnpj = cpf_cnpj.replace(/\D/g, "");

    const values = [name, email, password, cpf_cnpj];

    try {
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

      return res.render("users/index", { user, formFull: true });

    } catch (error) {
      console.error(error);

      return res.render("users/index", {
        message: "Erro inesperado!",
        type: "error"
      })
    }
  },
  async update(req, res) {
    let { name, email, password, cpf_cnpj } = req.body;

    cpf_cnpj = cpf_cnpj.replace(/\D/g, "");

    const values = { name, email, password, cpf_cnpj };

    try {
      await User.edit(user.id, { ...values });

      return res.render("users/index", {
        message: "Dados atualizados com sucesso!",
        type: "success"
      })

    } catch (error) {
      console.error(error);

      return res.render("users/register", {
        message: "Erro inesperado!",
        type: "error"
      });
    }
  }
}

export default UserController;