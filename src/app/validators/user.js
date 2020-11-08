import { compare } from "bcryptjs";
import User from "../models/User";

const Needed = {
  checkAllFields(body) {
    const keys = Object.keys(body);

    for (const key of keys) {
      if (body[key] == "") return {
        user: body,
        message: "Preencha todos os campos corretamente!",
        type: "error"
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
    try {
      const { userID: id } = req.session;

      const user = await User.getBy({ where: { id } });

      if (!user) return res.render("users/register", {
        message: "Usuário não encontrado!",
        type: "error"
      });

      req.user = user;

      next();
    } catch (error) {
      console.error(error);
    }
  },
  async update(req, res, next) {
    const fillAllFields = Needed.checkAllFields(req.body);

    if (fillAllFields) {
      return res.render("users/register", fillAllFields);
    }

    const { id, password } = req.body;

    if (!password) {
      return res.render("users/index", {
        message: "Coloque sua senha para atualizar.",
        type: "warning"
      });
    }

    const user = await User.getBy({ where: { id } });
    const passad = await compare(password, user.password);

    if (!passad) {
      return res.render("users/index", {
        user: req.body,
        message: "Senha incorreta",
        type: "error"
      });
    }

    req.user;
    next();
  }
}

export default Validators;