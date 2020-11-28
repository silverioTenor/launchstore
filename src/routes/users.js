import multer from '../middlewares/multer';
import { Router } from 'express';

const routes = Router();

import UserValidator from '../app/validators/user';
import SessionValidator from '../app/validators/session';
import SessionController from '../app/controllers/SessionController';
import UserController from '../app/controllers/UserController';

import { onlyUsers as isLogged } from '../middlewares/session';

// Login/Logout
routes.get("/login", SessionController.loginForm);
routes.post("/login", SessionValidator.login, SessionController.login);
routes.post("/logout", SessionController.logout);

// Password/Forgot
routes.get("/forgot-password", SessionController.forgotForm);
routes.get("/password-reset", SessionController.resetForm);
routes.post("/forgot-password", SessionValidator.forgot, SessionController.forgot);
routes.post("/password-reset", SessionValidator.reset, SessionController.reset);

// Register
routes.get("/", (req, res) => res.redirect("/users/register"));
routes.get("/register", UserController.registerForm);
routes.post("/register", UserValidator.post, UserController.post);

routes.get("/show/:id", isLogged, UserValidator.show, UserController.show);
routes.put("/", multer.array("photo", 1), UserValidator.update, UserController.update);
routes.delete("/", UserController.delete);

export default routes;