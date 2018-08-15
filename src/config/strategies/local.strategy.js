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
        const result = await sql.query('SELECT id, user, rank FROM tblUser WHERE user = ? AND pw = ?', [username, password]);
        if (result === undefined || result.length === 0) {
          done(null, false);
        } else {
          const user = result[0]
          done(null, user);
        }
      }());
    }
  ));
}

module.exports = localStrategy;
