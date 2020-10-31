import express from 'express';
import { urlencoded, static } from 'express';
import nunjucks from 'nunjucks';
import methodOverride from 'method-override';

import routes from './routes';

const server = express();

server.use(urlencoded({ extended: true }));
server.use(static('public'));
server.use(methodOverride('_method'));
server.use(routes);

server.set("view engine", "njk");

nunjucks.configure("src/app/views", {
  express: server,
  autoescape: false,
  noCache: true
});

server.listen(5000, () => console.log("Server is running..."));