import multer from '../middlewares/multer';
import { Router } from 'express';

const routes = Router();

import Validators from '../app/validators/user';
import SessionController from '../app/controllers/auth/SessionController';
import UserController from '../app/controllers/auth/UserController';

// Login/Logout
routes.get("/login", SessionController.loginForm);
routes.post("/login", SessionController.login);
routes.post("/logout", SessionController.logout);

// Password/Forgot
// routes.get("/forgot-password", SessionController.forgotForm);
// routes.get("/password-reset", SessionController.resetForm);
// routes.post("/forgot-password", SessionController.forgot);
// routes.post("/password-reset", SessionController.reset);

// Register
routes.get("/register", UserController.registerForm);
routes.post("/register", Validators.post, UserController.post);

routes.get("/show/:id", Validators.show, UserController.show);
routes.put("/", multer.array("photo", 1), Validators.update, UserController.update);
// routes.delete("/", UserController.delete);

export default routes;