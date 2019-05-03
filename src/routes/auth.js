const express = require('express');
const debug = require('debug')('app:auth');
const passport = require('passport');
const authRouter = express.Router();

function router() {
    authRouter.route('/bnet')
    .get(passport.authenticate('bnet', {
        scope: ['wow.profile']
    }))

    authRouter.route('/bnet/callback')
        .get(passport.authenticate('bnet', {
        successRedirect: '/',
        failureRedirect: '/'
        }));
    
    return authRouter
}


module.exports = router;