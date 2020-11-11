export function onlyUsers(req, res, next) {
  if (!req.session.user.userID) {
    return res.redirect("/users/login");
  }
  next();
}