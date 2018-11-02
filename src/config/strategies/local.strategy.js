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
        const uResult = await sql.query('SELECT id, user, rank, theme FROM tblUser WHERE user = ? AND pw = ?', [username, password]);

        if (uResult === undefined || uResult.length === 0) {
          return done(null, false);
        } else {
          const user = uResult[0]
          const cResult = await sql.query('SELECT id FROM tblCharacter WHERE user_id = ? AND main = 1', [user.id])
          cResult[0] && (user['main'] = cResult[0].id)
          return done(null, user);
        }
      }());
    }
  ));
}

module.exports = localStrategy;
