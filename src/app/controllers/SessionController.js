import crypto from 'crypto';
import { hash } from 'bcryptjs';
import mailer from '../../lib/mailer';

import User from '../models/User';

const SessionController = {
  registerForm(req, res) {
    if (req.query.status == 400) {
      return res.render("users/register", {
        message: "Erro inesperado!",
        type: "error",
        formFull: false
      });
    } else {
      return res.render("users/register");
    }
  },
  async register(req, res) {
    try {
      let { name, email, password, cpf_cnpj } = req.body;

      password = await hash(password, 8);
      cpf_cnpj = cpf_cnpj.replace(/\D/g, "");

      const values = { name, email, password, cpf_cnpj };

      const userDB = new User();
      await userDB.create(values);

      return res.redirect("/session/login");

    } catch (error) {
      console.error(error);

      return res.redirect("session/register?status=400");
    }
  },
  loginForm(req, res) {
    if (req.query.status == 200) {
      return res.render("session/login", {
        message: "Operação feita com sucesso!",
        type: "success"
      });
    } else if (req.query == 400) {
      return res.render("session/login", {
        message: "Erro insperado. Tente novamente.",
        type: "error"
      });
    } else {
      return res.render("session/login");
    }
  },
  login(req, res) {
    req.session.user = req.user;
    const userID = req.user.userID;

    return res.redirect(`/users/profile/${userID}`);
  },
  logout(req, res) {
    req.session.destroy();

    return res.redirect("/session/login");
  },
  forgotForm(req, res) {
    return res.render("session/forgot/forgot-password");
  },
  async forgot(req, res) {
    try {
      const { user } = req;

      // Criação do token
      const token = crypto.randomBytes(20).toString("hex");

      // Tempo de expiração do token
      let now = new Date();
      now = now.setHours(now.getHours() + 1);

      const values = {
        id: user.id,
        column: "id"
      };

      const userDB = new User();
      await userDB.update(values, {
        reset_token: token,
        reset_token_expires: now
      });

      // Enviar e-mail com link de recuperação
      await mailer.sendMail({
        to: user.email,
        from: 'no-reply@launchstore.com',
        subject: 'Recuperação de senha',
        html: `
          <h2>Esqueceu sua senha?</h2>
          <p>Fica tranquilo! Aqui está o link para criar uma nova senha.</p>
          <p>
            <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">CRIAR NOVA SENHA</a>
          </p>
          <br>
          <h4><b>Atenção!</b></h4>
          <p>O link expira em 1 hora.</p>
        `
      });

      // Avisa ao usuário que um e-mail com o link foi enviado
      return res.redirect("session/login?status=200");

    } catch (error) {
      console.error(`Unexpected error in token: ${error}`);

      return res.redirect("session/forgot/forgot-password?status=400");
    }
  },
  resetForm(req, res) {
    const { token } = req.query;
    return res.render("session/reset/password-reset", { token });
  },
  async reset(req, res) {
    const { user } = req;
    const { password, token } = req.body;

    try {
      // Cria um novo hash de senha
      const newPassword = await hash(password, 8);

      // Atualiza o usuário
      const values = {
        id: user.id,
        column: "id"
      };

      const userDB = new User();
      await userDB.update(values, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: ""
      });

      // Informa que a senha foi alterada com sucesso
      return res.redirect("session/login?status=200");

    } catch (error) {
      console.error(`Unexpected error in reset: ${error}`);

      return res.render("session/reset/password-reset", {
        token,
        message: "Erro insperado. Tente novamente mais tarde.",
        type: "error"
      });
    }
  }
}

export default SessionController;