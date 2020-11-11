import { compare } from "bcryptjs";

import User from "../models/User";

const Validators = {
  async login(req, res, next) {

    let { email, password } = req.body;
    let user = {};
    let passed = "";

    try {
      user = await User.getBy({ where: { email } });

    } catch (error) {
      console.error(`Search user failure. error: ${error}`);

      return res.render("session/login", {
        user: req.body,
        message: "Usuário não encontrado!",
        type: "error"
      });
    }

    if (user && user != "" || user != undefined) {
      passed = await compare(password, user.password);
      
      if (!passed) return res.render("session/login", {
        user: req.body,
        message: "Senha incorreta!",
        type: "error"
      });
    }

    req.userID = user.id;

    next();
  }
}

export default Validators;