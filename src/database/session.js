import session from 'express-session';
import pgSession from 'connect-pg-simple';
import db from './config';

pgSession = pgSession(session);

export default session({
  store: new pgSession({ pool: db }),
  secret: 'gaki',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
});