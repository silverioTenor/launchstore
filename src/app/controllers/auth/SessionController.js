const SessionController = {
  loginForm(req, res) {
    return res.render("session/login");
  },
  login(req, res) {},
  logout(req, res) {
    req.session.destroy();

    return res.redirect("/");
  }
}

export default SessionController;