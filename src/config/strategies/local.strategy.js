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
        const result = await sql.query('SELECT id, pw, user, rank FROM tblUser WHERE user = ?', [username]);
        if (result === undefined || result.length === 0) {
          done(null, false);
        } else {
          const user = result[0]
          if (user.pw === password) {
            done(null, user);
          } else {
            done(null, false);
          }
        }
      }());
    }
  ));
}

module.exports = localStrategy;
