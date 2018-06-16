// => node modules
const express = require('express');
const debug = require('debug')('app:scRoutes');
const passport = require('passport');

// => defining routes
const scarecrowRouter = express.Router();

// => db connection
const sql = require('../js/db');

function router() {
  // => root of the scarecrow router
  scarecrowRouter.route('/').get((req, res) => {
    let rank = 0;
    if (req.user) {
      rank = req.user.rank;
    }
    getPages(rank, function(scMenu){
      (async function dbQuery() {
        res.render('sc-home', { scMenu, title: '<Scarecrow>' });
      }());
    });
  });
  // => The rest of the routes, pages you might want to open up
  scarecrowRouter.route('/admin')
    .all((req, res, next) => {
      if(req.user && req.user.rank === 8) {
        next();
      } else {
        res.redirect('/signIn');
      }
    })
    .get((req, res) => {
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          res.render('sc', { scMenu, activePage: 'Admin', title: '<Scarecrow>' });
        }());
      });
    });
  scarecrowRouter.route('/apply')
    .all((req, res, next) => {
      if(req.user && req.user.rank >= 1) {
        next();
      } else {
        res.redirect('/signUp');
      }
    })
    .get((req, res) => {
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          res.render('sc', { scMenu, activePage: 'Apply', title: '<Scarecrow>' });
        }());
      });
  });
  scarecrowRouter.route('/events')
    .all((req, res, next) => {
      if(req.user && req.user.rank >= 2) {
        next();
      } else {
        res.redirect('/signIn');
      }
    })
    .get((req, res) => {
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          res.render('sc', { scMenu, activePage: 'Events', title: '<Scarecrow>' });
        }());
      });
    });
  scarecrowRouter.route('/forum')
    .all((req, res, next) => {
      if(req.user) {
        next();
      } else {
        res.redirect('/signIn');
      }
    })
    .get((req, res) => {
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          res.render('sc', { scMenu, activePage: 'Forum', title: '<Scarecrow>' });
        }());
      });
    });
  scarecrowRouter.route('/forum/:id').get((req, res) => {
    const forumID = req.params.id;
    // const {id} = req.params;
    res.render('sc', { scMenu, activePage: 'Forum' });
  });
  scarecrowRouter.route('/hierarchy').get((req, res) => {
    let rank = 0;
    if (req.user) {
      rank = req.user.rank;
    }
    getPages(rank, function(scMenu){
      (async function dbQuery() {
        res.render('sc', { scMenu, activePage: 'Hierarchy', title: '<Scarecrow>' });
      }());
    });
  });
  scarecrowRouter.route('/loot')
    .all((req, res, next) => {
      if(req.user) {
        next();
      } else {
        res.redirect('/signIn');
      }
    })
    .get((req, res) => {
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          res.render('sc', { scMenu, activePage: 'Loot', title: '<Scarecrow>' });
        }());
      });
    });
  scarecrowRouter.route('/profile')
    .all((req, res, next) => {
      if(req.user) {
        debug(req.user);
        next();
      } else {
        res.redirect('/signIn');
      }
    })
    .get((req, res) => {
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const characters = await sql.query('SELECT id, name, class, role FROM tblCharacter WHERE user_id = ?', [req.user.id]);
          const user = await sql.query('SELECT u.user, r.name as "rank", u.email FROM tblUser u JOIN tblRank r ON u.rank = r.id WHERE u.id = ?', [req.user.id]);
          debug(user);
          res.render('sc-profile', { scMenu, activePage: 'Profile', characters, user, title: '<Scarecrow>' });
        }());
      });
    });
  scarecrowRouter.route('/progression').get((req, res) => {
    let rank = 0;
    if (req.user) {
      rank = req.user.rank;
    }
    getPages(rank, function(scMenu){
      (async function dbQuery() {
        const result = await sql.query('SELECT instance, boss, status FROM tblProgression');
        var progression = {};
        for (var i in result) {
          if (!(result[i].instance in progression)) {
            progression[result[i].instance] = [];
          }
          var x = {};
          x['boss'] = result[i].boss;
          x['status'] = result[i].status;
          progression[result[i].instance].push(x);
        }
        //debug(progression);
        res.render('sc-progression', { scMenu, activePage: 'Progression', progression, title: '<Scarecrow>' });
      }());
    });
    (async function dbQuery() {

    }());
  });
  scarecrowRouter.route('/signIn')
    .all((req, res, next) => {
      next();
      debug('test');
    })
    .get((req, res) => {
      let rank = 0;
      if (req.user) {
        rank = req.user.rank;
      }
      getPages(rank, function(scMenu){
        (async function dbQuery() {
          res.render('sc-signIn', { scMenu, title: '<Scarecrow>' });
        }());
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/signIn'
    }));
    scarecrowRouter.route('/signUp')
      .get((req, res) => {
        let rank = 0;
        if (req.user) {
          rank = req.user.rank;
        }
        getPages(rank, function(scMenu){
          (async function dbQuery() {
            res.render('sc-signUp', { scMenu, title: '<Scarecrow>' });
          }());
        });
      })
      .post((req, res) => {
        (async function addUser() {
          const newUser = await sql.query('INSERT INTO tblUser (user, pw, email, rank) VALUES (?, ?, ?, 1)', [req.body.username, req.body.password, req.body.email]);
          const getUser = await sql.query('SELECT id, pw, user, rank FROM tblUser WHERE user = ? AND pw = ?', [req.body.username, req.body.password]);
          const user = getUser[0];
          req.login(user, () => {
            res.redirect('/');
          });
        }());
      });
  // => API for the various database calls
  scarecrowRouter.route('/api').post((req, res) => {
    debug(req.body);
    (async function dbQuery() {
      if (req.body.request === 'characterDelete') {
        const result = await sql.query('DELETE FROM tblCharacter WHERE id = ? AND name = ? AND class = ? AND user_id', [req.body.cID, req.body.cName, req.body.cClass, req.user.id]);
        res.send('Success!');
      }
      else if (req.body.request === 'characterSubmitNew') {
        const result = await sql.query('INSERT INTO tblCharacter (name, class, role, user_id) VALUES (?, ?, ?, ?)', [req.body.cName, req.body.cClass, req.body.cRole, req.user.id]);
        res.send('Success!');
      }
      else if (req.body.request === 'getCharacterClasses') {
        const result = await sql.query('SELECT name, isDamage, isSupport, isTank FROM tblClass WHERE available = 1')
        res.json(result);
      }
      else if (req.body.request === 'userInformationUpdate') {
        const result = await sql.query('UPDATE tblUser SET user = ?, email = ? WHERE id = ?', [req.body.username, req.body.email, req.user.id]);
        res.send('Success!');
      }
    }());
  });
  return scarecrowRouter;
}

function getPages(rank, success) {
  (async function dbQuery() {
    const result = await sql.query('SELECT name, path, menu FROM tblPages WHERE rank_id <= ?', [rank]);
    let scMenu = {};
    for (var i in result) {
      let obj = {};
      obj['path'] = result[i].path;
      obj['menu'] = result[i].menu;
      scMenu[result[i].name] = obj;
    }
    success(scMenu);
  }());
}

module.exports = router;
