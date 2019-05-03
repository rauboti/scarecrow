// => node modules
const passport = require('passport');
const { Strategy } = require('passport-bnet');
const debug = require('debug')('app:bnet.strategy');
const sql = require('../../js/db'); 

// => Battle.net
var BNET_ID = 'bf56290b9c05469db6424bb9b294177b';
var BNET_SECRET = 'yYGgbjSb2fM1CPLtHBwr001RXU75MiZ2';

function bnetStrategy() {
  passport.use(new Strategy(
    {
      clientID: BNET_ID,
      clientSecret: BNET_SECRET,
      //callbackURL: "http://localhost:4000/auth/bnet/callback/",
      callbackURL: "https://scarecrow.rauboti.net/auth/bnet/callback/",
      region: 'eu'
    }, (accessToken, refreshToken, profile, done) => {
      (async function dbQuery() {       
        const userExcists = await sql.query('SELECT id, user, rank, theme FROM tblUser WHERE id = ?', [profile.id]);
        if (userExcists === undefined || userExcists.length === 0) {
          const addUser = await sql.query('INSERT INTO tblUser (id, user, rank, theme) VALUES (?, ?, 1, "scarecrow")', [profile.id, profile.battletag])
          const result = await sql.query('SELECT id, user, rank, theme FROM tblUser WHERE id = ?', [profile.id]);
          return done(null, result[0]);
        } else {
          const user = userExcists[0]
          const cResult = await sql.query('SELECT id FROM tblCharacter WHERE user = ? AND main = 1', [user.id])
          cResult[0] && (user['main'] = cResult[0].id)
          user['token'] = profile.token;
          return done(null, user);
        }
      }());
    }
  ));
}

module.exports = bnetStrategy;
