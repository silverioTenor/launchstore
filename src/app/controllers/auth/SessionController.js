const SessionController = {
  loginForm(req, res) {},
  login(req, res) {},
  logout(req, res) {
    req.session.destroy();

    return res.redirect("/");
  }
}

export default SessionController;