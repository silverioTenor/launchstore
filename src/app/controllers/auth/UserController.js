import User from './../../models/User';

const UserControler = {
  registerForm(req, res) {
    return res.render("users/register");
  },
  async post(req, res) {
    return res.json({ message: "Passed!"});
  }
}

export default UserControler;