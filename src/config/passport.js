const passport = require('passport');
//require('./strategies/local.strategy')();
require('./strategies/bnet.strategy')();

function passportConfig(app) {
  app.use(passport.initialize());
  app.use(passport.session());
  // => stores user in session
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  // => retreive user from session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}
module.exports = passportConfig;
