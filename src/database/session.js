import session from 'express-session';
import connectPg from 'connect-pg-simple';
import db from './config.js';

const Storage = connectPg(session);

const newSession = session({
  store: new Storage({ pool: db }),
  secret: 'gaki',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
});

export default newSession;