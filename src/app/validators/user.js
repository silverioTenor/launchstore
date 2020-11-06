import User from "../models/User";

const Validators = {
  async post(req, res, next) {
    const keys = Object.keys(req.body);
  
    for (const key of keys) {
      if (req.body[key] == "") return res.json({ message: "Please! Fill all fields." });
    }
  
    const { email, cpf_cnpj, password, passwordRepeat } = req.body;
  
    cpf_cnpj = cpf_cnpj.replace(/\D/g, "");
  
    const user = await User.getBy({
      where: { email },
      or: { cpf_cnpj }
    });
  
    if (user) return res.json({ message: "User exist!" });
  
    if (password != passwordRepeat) return res.json({ message: "Password mismatch" });
  
    next();
  }
}

export default Validators;