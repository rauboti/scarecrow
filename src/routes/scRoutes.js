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
        let session;
        if (req.user) {
          session = 'in';
        } else {
          session = 'out';
        }
        res.render('home', { scMenu, activePage: 'Home', title: '<Scarecrow>', session });
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
          const userList = await sql.query('SELECT u.id, u.user, u.rank as "rankid", r.name as "rank", u.role FROM tblUser u JOIN tblRank r on r.id = u.rank ORDER BY u.rank DESC, u.user ASC');
          res.render('admin', { scMenu, activePage: 'Admin', title: '<Scarecrow>', userList });
        }());
      });
    });
  scarecrowRouter.route('/admin/user/:id')
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
          const { id }  = req.params;
          const user = await sql.query('SELECT u.user, u.rank, r.name as "rankName", u.email, u.role FROM tblUser u JOIN tblRank r ON u.rank = r.id WHERE u.id = ?', [id]);
          //const ranks = await sql.query('SELECT * FROM tblRank');
          const characters = await sql.query('SELECT id, name, class, role, main FROM tblCharacter WHERE user_id = ?', [id]);
          debug(characters);
          res.render('user', { scMenu, activePage: 'Admin', title: '<Scarecrow>', user, characters });
        }());
      });
    })
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);
        if (req.body.back) {
          res.redirect('/admin');
        } else if (req.body.delete) {
          if (req.body.delete === 'user') {
            const deleteCharacters = await sql.query('DELETE FROM tblCharacter WHERE user_id = ?', [req.params.id]);
            const deleteUser = await sql.query('DELETE FROM tblUser WHERE id = ?', [req.params.id]);
            res.redirect('/admin');
          } else if (req.body.delete.split('_')[0] === 'character') {
            const result = await sql.query('DELETE FROM tblCharacter WHERE id = ? AND user_id = ?', [req.body.delete.split('_')[1], req.params.id]);
            res.redirect(req.get('referer'));
          }
        } else if (req.body.add) {
          if (req.body.add === 'character') {
            const result = await sql.query('INSERT INTO tblCharacter (name, class, role, user_id, main) VALUES (?, ?, ?, ?, ?)', [req.body.cName, req.body.cClass, req.body.cRole, req.params.id, 'alt']);
            res.redirect(req.get('referer'));
          }
        } else if (req.body.main) {
          const resetMainCharacters = await sql.query('UPDATE tblCharacter SET main = ? WHERE user_id = ?', ['alt', req.params.id]);
          const setNewMainCharacter = await sql.query('UPDATE tblCharacter SET main = ? WHERE user_id = ? AND id = ?', ['main', req.params.id, req.body.main.split('_')[1]])
          res.redirect(req.get('referer'));
        } else if (req.body.update === 'general') {
          const result = await sql.query('UPDATE tblUser SET user = ?, rank = ?, role = ?, email = ? WHERE id = ?', [req.body.username, req.body.rank, req.body.role, req.body.email, req.params.id]);
          res.redirect(req.get('referer'));
        }
      }());
    });
  scarecrowRouter.route('/applications')
    .all((req, res, next) => {
      if(req.user && req.user.rank >= 6) {
        next();
      } else {
        res.redirect('/signIn');
      }
    })
    .get((req, res) => {
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const result = await sql.query('SELECT id, status, character_name, character_class, character_role, character_level FROM tblApplications');
          var applications = {}
          applications['New'] = []
          applications['Accepted'] = []
          applications['Declined'] = []

          for (var i in result) {
            var x = {};
            x['id'] = result[i].id;
            x['name'] = result[i].character_name;
            x['class'] = result[i].character_class;
            x['role'] = result[i].character_role;
            x['level'] = result[i].character_level;
            applications[result[i].status].push(x);
          }

          res.render('applications', { scMenu, activePage: 'Applications', title: '<Scarecrow>', applications });
        }());
      });
    });
    scarecrowRouter.route('/applications/:id')
      .all((req, res, next) => {
        if(req.user && req.user.rank >= 6) {
          next();
        } else {
          res.redirect('/signIn');
        }
      })
      .get((req, res) => {
        getPages(req.user.rank, function(scMenu){
          (async function dbQuery() {
            const { id }  = req.params;
            const application = await sql.query('SELECT user, status, character_name, character_class, character_role, character_level, spec, armory, raids, preparation, asset, mistakes, anything_else FROM tblApplications WHERE id = ?', [id]);
            res.render('application', { scMenu, activePage: 'Applications', title: '<Scarecrow>', application });
          }());
        });
      })
      .post((req, res) => {
        (async function dbQuery() {
          if (req.body.back) {
            //
          } else if (req.body.accept) {
            const result = await sql.query('UPDATE tblApplications SET status = ? WHERE id = ?', ['Accepted', req.params.id]);
          } else if (req.body.decline) {
            const result = await sql.query('UPDATE tblApplications SET status = ? WHERE id = ?', ['Declined', req.params.id]);
          }
          res.redirect('/applications');
        }());
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
          const classes = await sql.query('SELECT name, isDamage, isSupport, isTank FROM tblClass WHERE available = 1')
          const username = req.user.user;
          res.render('apply', { scMenu, activePage: 'Apply', title: '<Scarecrow>', username, classes });
        }());
      });
    })
    .post((req, res) => {
      (async function submitApplication() {
        let ID = createID();
        let appExcists = await sql.query('SELECT * from tblApplications WHERE id = ?', [ID]);
        while (appExcists.length !== 0) {
          ID = createID();
          appExcists = await sql.query('SELECT * from tblApplications WHERE id = ?', [ID]);
        }
        const result = await sql.query('INSERT INTO tblApplications (id, user, status, character_name, character_class, character_role, character_level, spec, armory, raids, preparation, asset, mistakes, anything_else) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [ID, req.user.id, 'New', req.body.characterName, req.body.characterClass, req.body.characterRole, req.body.characterLevel, req.body.specLink, req.body.armoryLink, req.body.numberRaids, req.body.preparation, req.body.asset, req.body.mistake, req.body.anythingElse]);
        res.redirect('/');
      }());
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
        const users = await sql.query('SELECT u.user, r.name as "rank", u.role FROM tblUser u JOIN tblRank r ON u.rank = r.id ORDER BY r.name, u.user');
        res.render('hierarchy', { scMenu, activePage: 'Hierarchy', title: '<Scarecrow>', users });
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
        next();
      } else {
        res.redirect('/signIn');
      }
    })
    .get((req, res) => {
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const user = await sql.query('SELECT u.user, u.rank, r.name as "rankName", u.email, u.role FROM tblUser u JOIN tblRank r ON u.rank = r.id WHERE u.id = ?', [req.user.id]);
          const characters = await sql.query('SELECT id, name, class, role, main FROM tblCharacter WHERE user_id = ?', [req.user.id]);
          res.render('profile', { scMenu, activePage: 'Profile', characters, user, title: '<Scarecrow>' });
        }());
      });
    })
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);
        if (req.body.add) {
          if (req.body.add === 'character') {
            const result = await sql.query('INSERT INTO tblCharacter (name, class, role, user_id, main) VALUES (?, ?, ?, ?, ?)', [req.body.cName, req.body.cClass, req.body.cRole, req.user.id, 'alt']);
          }
        } else if (req.body.edit) {
          if (req.body.edit === 'userInfo') {
            const result = await sql.query('UPDATE tblUser SET user = ?, email = ? WHERE id = ?', [req.body.username, req.body.email, req.user.id]);
          }
        } else if (req.body.delete) {
          if (req.body.delete.split('_')[0] === 'character') {
            const result = await sql.query('DELETE FROM tblCharacter WHERE id = ? AND user_id = ?', [req.body.delete.split('_')[1], req.user.id]);
          }
        }
        res.redirect(req.get('referer'));
      }());
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
          x['name'] = result[i].boss;
          x['status'] = result[i].status;
          progression[result[i].instance].push(x);
        }
        res.render('progression', { scMenu, activePage: 'Progression', progression, title: '<Scarecrow>' });
      }());
    });
  });
  scarecrowRouter.route('/signIn')
    .get((req, res) => {
      let rank = 0;
      if (req.user) {
        rank = req.user.rank;
      }
      getPages(rank, function(scMenu){
        (async function dbQuery() {
          res.render('signIn', { scMenu, activePage: 'Sign in', title: '<Scarecrow>' });
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
          res.render('signUp', { scMenu, activePage: 'Sign up', title: '<Scarecrow>' });
        }());
      });
    })
    .post((req, res) => {
      (async function addUser() {
        let ID = createID();
        let userExcists = await sql.query('SELECT * from tblUser WHERE id = ?', [ID]);
        while (userExcists.length !== 0) {
          ID = createID();
          userExcists = await sql.query('SELECT * from tblUser WHERE id = ?', [ID]);
        }
        const newUser = await sql.query('INSERT INTO tblUser (id, user, pw, email, rank) VALUES (?, ?, ?, ?, 1)', [ID, req.body.username, req.body.password, req.body.email]);
        const getUser = await sql.query('SELECT id, user, rank FROM tblUser WHERE user = ? AND pw = ?', [req.body.username, req.body.password]);
        const user = getUser[0];
        req.login(user, () => {
          res.redirect('/apply');
        });
      }());
    });
  // => API for the various database calls
  scarecrowRouter.route('/api').post((req, res) => {
    (async function dbQuery() {
      if (req.body.request === 'getCharacterClasses') {
        const result = await sql.query('SELECT name, isDamage, isSupport, isTank FROM tblClass WHERE available = 1')
        res.json(result);
      } else if (req.body.request === 'getUserRanks') {
        const result = await sql.query('SELECT * FROM tblRank');
        res.json(result);
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
    if (rank > 0) {
      scMenu['Sign in'].menu = 0;
    }
    if (rank > 1) {
      scMenu['Apply'].menu = 0;
    }
    success(scMenu);
  }());
}

function createID() {
  function rndLtr() {
    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return rndLtr() + rndLtr() + rndLtr() + rndLtr() + '-' + rndLtr() + rndLtr() +  rndLtr() + rndLtr() + rndLtr() + rndLtr() + rndLtr() + '-' + rndLtr() + rndLtr() + rndLtr() + rndLtr() + rndLtr();
}

module.exports = router;
