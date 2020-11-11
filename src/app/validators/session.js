import { compare } from "bcryptjs";

import User from "../models/User";
import FilesManager from './../models/FilesManager';

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

    const column = "user_id";
    const values = { id: user.id, column };
    let photo = {};

    try {
      photo = await FilesManager.get(values);

    } catch (error) {
      console.error(`oparation failure. error: ${error}`)
    }

    if (photo !== "undefined" || Object.keys(photo.path).length > 0) {
      user.photo = `${req.protocol}://${req.headers.host}${photo.path}`.replace("public", "");
    }

    req.user = {
      userID: user.id,
      name: user.name.split(" ")[0],
      photo: user.photo
    };

    next();
  }
}

export default Validators;