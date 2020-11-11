const SessionController = {
  loginForm(req, res) {
    return res.render("session/login");
  },
  login(req, res) {
    req.session.user = req.user;
    const userID = req.user.userID;

    return res.redirect(`/users/show/${userID}`);
  },
  logout(req, res) {
    req.session.destroy();

    return res.redirect("/users/login");
  }
}

export default SessionController;