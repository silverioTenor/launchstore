import express from 'express';
import { urlencoded, static as expressStatic } from 'express';
import nunjucks from 'nunjucks';
import methodOverride from 'method-override';
import fs from 'node:fs';
import path from 'node:path';

import session from './database/session.js';
import routes from './routes/index.js';

const server = express();

server.use(session);
server.use((req, res, next) => {
  res.locals.session = req.session;
  next();
})

server.use(urlencoded({ extended: true }));
server.use(expressStatic('public'));
server.use(methodOverride('_method'));
server.use(routes);

server.set("view engine", "njk");

nunjucks.configure("src/app/views", {
  express: server,
  autoescape: false,
  noCache: true
});

if (!fs.existsSync(path.resolve('public', 'img', 'main'))) {
  fs.mkdirSync(path.resolve('public', 'img', 'main'), { recursive: true });
  console.log("Diretório 'public/img/main' criado.");
}

server.listen(5000, () => console.log("Server is running..."));