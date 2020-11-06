import User from "../models/User";

const Validators = {
  async post(req, res, next) {
    const keys = Object.keys(req.body);
  
    for (const key of keys) {
      if (req.body[key] == "") return res.render("users/register", {
        user: req.body,
        message: "Preencha todos os campos corretamente!",
        type: "error"
      });
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
  }
}

export default Validators;