import { Router } from 'express';

const routes = Router();

import SessionValidator from '../app/validators/session';
import SessionController from '../app/controllers/SessionController';

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
routes.get("/register", SessionController.registerForm);
routes.post("/register", SessionValidator.register, SessionController.register);

// Alias
routes.get("/", (req, res) => res.redirect("/session/login"));

export default routes;