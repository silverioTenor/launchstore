import { compare } from "bcryptjs";

import User from "../models/User";
import { getImages } from '../services/procedures';

const Validators = {
  async login(req, res, next) {

    let { email, password } = req.body;
    let user = {};
    let passed = "";

    try {
      const userDB = new User();
      user = await userDB.getBy({ where: { email } });

      if (!user) return res.render("session/login", {
        user: req.body,
        message: "Usuário não encontrado!",
        type: "error"
      });

    } catch (error) {
      console.error(`Search user failure. error: ${error}`);
    }

    if (user && user != "" || user != undefined) {
      passed = await compare(password, user.password);

      if (!passed) return res.render("session/login", {
        user: req.body,
        message: "Senha incorreta!",
        type: "error"
      });
    }

    try {
      const photo = await getImages({ id: user.id, column: "user_id" });

      req.user = {
        userID: user.id,
        name: user.name.split(" ")[0],
        photo: photo[0]
      };

      next();

    } catch (error) {
      console.error(`oparation failure. error: ${error}`);
    }
  },
  async forgot(req, res, next) {
    const { email } = req.body;

    try {
      const userDB = new User();
      user = await userDB.getBy({ where: { email } });

      if (!user) return res.render("session/forgot/forgot-password", {
        message: "E-mail não encontrado!",
        type: "error"
      });

      req.user = user;
      next();

    } catch (error) {
      console.error(`User not found. ${error}`);
    }
  },
  async reset(req, res, next) {
    // Procura o Usuário
    let { email, password, passwordRepeat, token } = req.body;
    let user = {};

    try {
      const userDB = new User();
      user = await userDB.getBy({ where: { email } });

      if (!user) return res.render("session/reset/password-reset", {
        token,
        message: "E-mail não cadastrado!",
        type: "error"
      });

    } catch (error) {
      console.error(`Unexpected error in ResetValidator: ${error}`);
    }

    // Confere a senha e a repetição de senha
    if (password !== passwordRepeat) {
      return res.render("session/reset/password-reset", {
        token,
        message: "As senhas não coincidem!",
        type: "error"
      });
    }

    // Confere se o token é válido
    if (token !== user.reset_token) {
      return res.render("session/reset/password-reset", {
        message: "Token inválido! Solicite uma nova recuperação de senha.",
        type: "error"
      });
    }

    // Confere se o token não expirou
    let now = new Date();
    now = now.setHours(now.getHours());

    if (now > user.reset_token_expires) {
      return res.render("session/reset/password-reset", {
        message: "Token expirado! Solicite uma nova recuperação de senha.",
        type: "error"
      });
    }

    req.user = user;
    next();
  }
}

export default Validators;