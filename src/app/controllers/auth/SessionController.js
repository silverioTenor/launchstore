const SessionController = {
  loginForm(req, res) {
    return res.render("session/login");
  },
  login(req, res) {
    const {userID} = req;
    req.session.userID = userID;
    
    return res.redirect(`/users/show/${userID}`);
  },
  logout(req, res) {
    req.session.destroy();

    return res.redirect("/users/login");
  }
}

export default SessionController;