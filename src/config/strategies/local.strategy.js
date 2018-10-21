const passport = require('passport');
const { Strategy } = require('passport-local');
const debug = require('debug')('app:local.strategy');
const sql = require('../../js/db');

function localStrategy() {
  passport.use(new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    }, (username, password, done) => {
      (async function dbQuery() {
        const result = await sql.query('SELECT id, user, rank, theme FROM tblUser WHERE user = ? AND pw = ?', [username, password]);
        if (result === undefined || result.length === 0) {
          return done(null, false);
        } else {
          const user = result[0]
          return done(null, user);
        }
      }());
    }
  ));
}

module.exports = localStrategy;
