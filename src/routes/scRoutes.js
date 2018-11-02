// => node modules
const express = require('express');
const debug = require('debug')('app:scRoutes');
const passport = require('passport');
const device = require('express-device');

// => defining routes
const pagerouter = express.Router();

// => db connection
const sql = require('../js/db');

function router() {

  // => root of the scarecrow router
  pagerouter.route('/')
    .get((req, res) => {
      req.user ? (rank = req.user.rank) : rank = 0;
      req.user ? theme = req.user.theme : theme = 'ghostly';

      getPages(rank, function(scMenu){
        (async function dbQuery() {
          const conf = {
            device: req.device.type.toLowerCase(),
            page: 'Home',
            rank: rank,
            theme: theme,
            title: '<Scarecrow>'
          }
          res.render('home', {scMenu, conf});
        }());
      });
    });

  // => The rest of the routes, pages you might want to open up
  pagerouter.route('/admin')
    .all((req, res, next) => { req.user && req.user.rank >= 6 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'ghostly';

      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const userList = await sql.query('SELECT u.id, u.user, u.rank as "rankid", r.name as "rank", u.role FROM tblUser u JOIN tblRank r on r.id = u.rank ORDER BY u.rank DESC, u.user ASC');

          const conf = {
            device: req.device.type.toLowerCase(),
            page: 'Admin',
            rank: rank,
            theme: theme,
            title: '<Scarecrow>'
          }
          res.render('admin', {scMenu, conf, userList});
        }());
      });
    })
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);

        if (req.body.add && req.body.add === 'event') {
          var ID = createID();
          var excists = await sql.query('SELECT * from tblEvent WHERE id = ?', [ID]);
          while (excists.length !== 0) {
            ID = createID();
            excists = await sql.query('SELECT * from tblEvent WHERE id = ?', [ID]);
          }
          const date = new Date(req.body.date);
          const result = await sql.query('INSERT INTO tblEvent (id, instance, time) VALUES (?, ?, ?)', [ID, parseInt(req.body.instance), date]);
          res.redirect(req.get('referer'));
        }

      }());
    });

  pagerouter.route('/admin/user/:id')
    .all((req, res, next) => { req.user && req.user.rank === 8 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'ghostly';

      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const { id }  = req.params;
          const user = await sql.query('SELECT u.user, u.rank, r.name as "rankName", u.email, u.role FROM tblUser u JOIN tblRank r ON u.rank = r.id WHERE u.id = ?', [id]);
          const characters = await sql.query('SELECT id, name, level, class, role, main FROM tblCharacter WHERE user_id = ?', [id]);

          const conf = {
            device: req.device.type.toLowerCase(),
            page: 'Admin',
            rank: rank,
            theme: theme,
            title: '<Scarecrow>'
          }
          res.render('user', { scMenu, conf, user, characters });
        }());
      });
    })
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);

        if (req.body.add && req.body.add === 'character') {
          var ID = createID();
          var excists = await sql.query('SELECT * from tblCharacter WHERE id = ?', [ID]);
          while (excists.length !== 0) {
            ID = createID();
            excists = await sql.query('SELECT * from tblCharacter WHERE id = ?', [ID]);
          }
          const result = await sql.query('INSERT INTO tblCharacter (id, name, level, class, role, user_id, main) VALUES (?, ?, ?, ?, ?, ?, ?)', [ID, req.body.cName, req.body.cLevel, req.body.cClass, req.body.cRole, req.params.id, 0]);
          res.redirect(req.get('referer'));
        } else if (req.body.back) {
          res.redirect('/admin');
        } else if (req.body.delete && req.body.delete.split('_')[0] === 'character') {
          const result = await sql.query('DELETE FROM tblCharacter WHERE id = ? AND user_id = ?', [req.body.delete.split('_')[1], req.params.id]);
          res.redirect(req.get('referer'));
        } else if (req.body.delete && req.body.delete === 'user') {
          const deleteCharacters = await sql.query('DELETE FROM tblCharacter WHERE user_id = ?', [req.params.id]);
          const deleteUser = await sql.query('DELETE FROM tblUser WHERE id = ?', [req.params.id]);
          res.redirect('/admin');
        } else if (req.body.main) {
          const resetMainCharacters = await sql.query('UPDATE tblCharacter SET main = ? WHERE user_id = ?', [0, req.params.id]);
          const setNewMainCharacter = await sql.query('UPDATE tblCharacter SET main = ? WHERE user_id = ? AND id = ?', [1, req.params.id, req.body.main.split('_')[1]])
          res.redirect(req.get('referer'));
        } else if (req.body.update && req.body.update === 'general') {
          const result = await sql.query('UPDATE tblUser SET user = ?, rank = ?, role = ?, email = ? WHERE id = ?', [req.body.username, req.body.rank, req.body.role, req.body.email, req.params.id]);
          res.redirect(req.get('referer'));
        }
      }());
    });

  pagerouter.route('/applications')
    .all((req, res, next) => { req.user && req.user.rank >= 6 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'ghostly';

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

          const conf = {
            device: req.device.type.toLowerCase(),
            page: 'Applications',
            rank: rank,
            theme: theme,
            title: '<Scarecrow>'
          }
          res.render('applications', { scMenu, conf, applications });
        }());
      });
    });

  pagerouter.route('/application/:id')
    .all((req, res, next) => { req.user && req.user.rank >= 6 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'ghostly';

      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const { id }  = req.params;
          const application = await sql.query('SELECT user, status, character_name, character_class, character_role, character_level, spec, armory, raids, preparation, asset, mistakes, anything_else FROM tblApplications WHERE id = ?', [id]);

          const conf = {
            device: req.device.type.toLowerCase(),
            page: 'Application',
            rank: rank,
            theme: theme,
            title: '<Scarecrow>'
          }
          res.render('application', { scMenu, conf, application });
        }());
      });
    })
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);

        req.body.accept && (result = await sql.query('UPDATE tblApplications SET status = ? WHERE id = ?', ['Accepted', req.params.id]))
        req.body.decline && (result = await sql.query('UPDATE tblApplications SET status = ? WHERE id = ?', ['Declined', req.params.id]))

        res.redirect('/applications')
      }());
    });

  pagerouter.route('/apply')
    .all((req, res, next) => { req.user && req.user.rank >= 1 ? next() : res.redirect('/signUp') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'ghostly';

      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const classes = await sql.query('SELECT name, isDamage, isSupport, isTank FROM tblClass WHERE available = 1')
          const username = req.user.user;

          const conf = {
            device: req.device.type.toLowerCase(),
            page: 'Apply',
            rank: rank,
            theme: theme,
            title: '<Scarecrow>'
          }

          res.render('apply', { scMenu, conf, username, classes });
        }());
      });
    })
    .post((req, res) => {
      (async function submitApplication() {
        var ID = createID();
        var excists = await sql.query('SELECT * from tblApplications WHERE id = ?', [ID]);
        while (excists.length !== 0) {
          ID = createID();
          excists = await sql.query('SELECT * from tblApplications WHERE id = ?', [ID]);
        }
        const application = await sql.query('INSERT INTO tblApplications (id, user, status, character_name, character_class, character_role, character_level, spec, armory, raids, preparation, asset, mistakes, anything_else) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [ID, req.user.id, 'New', req.body.characterName, req.body.characterClass, req.body.characterRole, req.body.characterLevel, req.body.specLink, req.body.armoryLink, req.body.numberRaids, req.body.preparation, req.body.asset, req.body.mistake, req.body.anythingElse]);
        const character = await sql.query('INSERT INTO tblCharacter (name, level, class, role, user_id, main) VALUES (?, ?, ?, ?, ?, ?)', [req.body.characterName, req.body.characterLevel, req.body.characterClass, req.body.characterRole, req.user.id, 1]);
        res.redirect('/');
      }());
    });

  pagerouter.route('/events')
    .all((req, res, next) => { req.user && req.user.rank >= 2 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'ghostly';

      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          var events = {}
          const result = await sql.query('SELECT e.id, i.name, e.time FROM tblEvent e JOIN tblInstance i on i.id = e.instance ORDER BY e.time ASC');

          for (var i in result) {
            d = new Date(result[i].time)
            var x = {}
            x['id'] = result[i].id;
            x['instance'] = result[i].name;
            x['day'] = Weekday(d.getDay());
            x['date'] = d.getDate();
            x['month'] = d.getMonth()+1;
            events[i] = x;
          }

          const conf = {
            device: req.device.type.toLowerCase(),
            page: 'Events',
            rank: rank,
            theme: theme,
            title: '<Scarecrow>'
          }

          res.render('events', { scMenu, conf, events });
        }());
      });
    });

  pagerouter.route('/event/:id')
    .all((req, res, next) => { req.user && req.user.rank >= 2 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'ghostly';

      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          var event = {}
          const { id }  = req.params;

          var result = await sql.query('SELECT id FROM tblCharacter WHERE user_id = ? AND main = 1', [req.user.id])
          result[0] && (req.user.main = result[0].id)

          result = await sql.query('SELECT i.name, e.time, i.tanks, i.support, i.damage FROM tblEvent e JOIN tblInstance i on i.id = e.instance WHERE e.id = ?', [id]);
          var d = new Date(result[0].time);
          event['day'] = Weekday(d.getDay());
          event['date'] = d.getDate();
          event['month'] = d.getMonth()+1;
          event['instance'] = result[0].name;
          event['tank'] = [];
          event['support'] = [];
          event['damage'] = [];
          event['max'] = {};
          event['max']['tanks'] = result[0].tanks
          event['max']['support'] = result[0].support
          event['max']['damage'] = result[0].damage
          var signed = false;

          result = await sql.query('SELECT c.id, es.event_index, c.name, c.class, c.role FROM tblEventSignup es JOIN tblCharacter c on c.id = es.char_id WHERE event_id = ?', [id]);
          for (var i in result) {
            (result[i].id === req.user.main) && (signed = true)
            var attendee = {}
            attendee['class'] = result[i].class
            attendee['idx'] = result[i].event_index
            attendee['name'] = result[i].name
            event[result[i].role.toLowerCase()].push(attendee);
          }

          const conf = {
            device: req.device.type.toLowerCase(),
            page: 'Events',
            rank: rank,
            theme: theme,
            main: req.user.main,
            signed: signed,
            title: '<Scarecrow>'
          }

          res.render('event', { scMenu, conf, event });
        }());
      });
    })
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);

        var ID = createID();
        var excists = await sql.query('SELECT * FROM tblEventSignup WHERE id = ?', [ID]);
        while (excists.length !== 0) {
          ID = createID();
          excists = await sql.query('SELECT * FROM tblEventSignup WHERE id = ?', [ID]);
        }

        if (req.body.accept) {
          const signups = await sql.query('SELECT count(*) as "total" FROM tblEventSignup WHERE event_id = ?', [req.params.id])
          const result = await sql.query('INSERT INTO tblEventSignup VALUES (?, ?, ?, ?)', [ID, req.params.id, (signups[0].total+1), req.user.main])
          res.redirect(req.get('referer'));
        }
        if (req.body.back) {
          res.redirect('/events');
        }
      }());
    });

  pagerouter.route('/forum')
    .all((req, res, next) => { req.user ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'ghostly';

      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {

          const conf = {
            device: req.device.type.toLowerCase(),
            page: 'Forum',
            rank: rank,
            theme: theme,
            title: '<Scarecrow>'
          }

          res.render('sc', { scMenu, conf });
        }());
      });
    });

  pagerouter.route('/hierarchy')
    .get((req, res) => {
      req.user ? rank = req.user.rank : rank = 0;
      req.user ? theme = req.user.theme : theme = 'ghostly';

      getPages(rank, function(scMenu){
        (async function dbQuery() {
          const users = await sql.query('SELECT u.user, r.name as "rank", u.role FROM tblUser u JOIN tblRank r ON u.rank = r.id ORDER BY r.name, u.user');

          const conf = {
            device: req.device.type.toLowerCase(),
            page: 'Hierarchy',
            rank: rank,
            theme: theme,
            title: '<Scarecrow>'
          }

          res.render('hierarchy', { scMenu, conf, users });
        }());
      });
    });

  pagerouter.route('/loot')
    .all((req, res, next) => { req.user ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'ghostly';

      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {

          const conf = {
            device: req.device.type.toLowerCase(),
            page: 'Loot',
            rank: rank,
            theme: theme,
            title: '<Scarecrow>'
          }

          res.render('sc', { scMenu, conf });
        }());
      });
    });

  pagerouter.route('/profile')
    .all((req, res, next) => { req.user ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'ghostly';

      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const user = await sql.query('SELECT u.user, u.rank, u.theme, r.name as "rankName", u.email, u.role FROM tblUser u JOIN tblRank r ON u.rank = r.id WHERE u.id = ?', [req.user.id]);
          const characters = await sql.query('SELECT id, name, level, class, role, main FROM tblCharacter WHERE user_id = ?', [req.user.id]);

          const conf = {
            device: req.device.type.toLowerCase(),
            page: 'Profile',
            rank: rank,
            theme: theme,
            title: '<Scarecrow>'
          }

          res.render('profile', { scMenu, conf, characters, user });
        }());
      });
    })
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);

        if (req.body.add && req.body.add === 'character') {
          var ID = createID();
          var excists = await sql.query('SELECT * from tblCharacter WHERE id = ?', [ID]);
          while (excists.length !== 0) {
            ID = createID();
            excists = await sql.query('SELECT * from tblCharacter WHERE id = ?', [ID]);
          }
          const result = await sql.query('INSERT INTO tblCharacter (id, name, level, class, role, user_id, main) VALUES (?, ?, ?, ?, ?, ?, ?)', [ID, req.body.cName, req.body.cLevel, req.body.cClass, req.body.cRole, req.user.id, 0]);
        } else if (req.body.delete && req.body.delete.split('_')[0] === 'character') {
          const result = await sql.query('DELETE FROM tblCharacter WHERE id = ? AND user_id = ?', [req.body.delete.split('_')[1], req.user.id]);
        } else if (req.body.edit && req.body.edit === 'userInfo') {
          const result = await sql.query('UPDATE tblUser SET user = ?, email = ?, theme = ? WHERE id = ?', [req.body.username, req.body.email, req.body.theme, req.user.id]);
          req.user.theme = req.body.theme;
        }

        res.redirect(req.get('referer'));
      }());
    });

  pagerouter.route('/progression')
    .get((req, res) => {
      req.user ? rank = req.user.rank : rank = 0;
      req.user ? theme = req.user.theme : theme = 'ghostly';

      getPages(rank, function(scMenu){
        (async function dbQuery() {
          var progression = {}
          const result = await sql.query('SELECT instance, boss, status FROM tblProgression');

          for (var i in result) {
            var x = {};
            !(result[i].instance in progression) && (progression[result[i].instance] = []);
            x['name'] = result[i].boss;
            x['status'] = result[i].status;
            progression[result[i].instance].push(x);
          }

          const conf = {
            device: req.device.type.toLowerCase(),
            page: 'Progression',
            rank: rank,
            theme: theme,
            title: '<Scarecrow>'
          }

          res.render('progression', { scMenu, conf, progression });
        }());
      });
    });

  pagerouter.route('/signIn')
    .get((req, res) => {
      req.user ? rank = req.user.rank : rank = 0;
      req.user ? theme = req.user.theme : theme = 'ghostly';

      getPages(rank, function(scMenu){
        (async function dbQuery() {

          const conf = {
            device: req.device.type.toLowerCase(),
            page: 'Sign in',
            rank: rank,
            theme: theme,
            title: '<Scarecrow>'
          }

          res.render('signIn', { scMenu, conf });
        }());
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/signIn'
    }));

  pagerouter.route('/signUp')
    .get((req, res) => {
      req.user ? rank = req.user.rank : rank = 0;
      req.user ? theme = req.user.theme : theme = 'ghostly';

      getPages(rank, function(scMenu){
        (async function dbQuery() {

          const conf = {
            device: req.device.type.toLowerCase(),
            page: 'Sign in',
            rank: rank,
            theme: theme,
            title: '<Scarecrow>'
          }

          res.render('signUp', { scMenu, conf });
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
        const newUser = await sql.query('INSERT INTO tblUser (id, user, pw, email, rank, theme) VALUES (?, ?, ?, ?, 1, "ghostly")', [ID, req.body.username, req.body.password, req.body.email]);
        const getUser = await sql.query('SELECT id, user, rank, theme FROM tblUser WHERE user = ? AND pw = ?', [req.body.username, req.body.password]);
        const user = getUser[0];

        req.login(user, () => {
          res.redirect('/apply');
        });
      }());
    });

  // => API for the various database calls
  pagerouter.route('/api/get')
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);

        req.body.request === 'classes' && (result = await sql.query('SELECT name, isDamage, isSupport, isTank FROM tblClass WHERE available = 1'))
        req.body.request === 'instances' && (result = await sql.query('SELECT id, name FROM tblInstance'))
        req.body.request === 'ranks' && (result = await sql.query('SELECT * FROM tblRank'))
        req.body.request === 'themes' && (result = await sql.query('SELECT * FROM tblTheme'))

        res.json(result);
      }());
    });

  return pagerouter;
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

const Weekday = (n) => {
  var d = new Array(7);
  d[0] = "Sun"; d[1] = "Mon"; d[2] = "Tue"; d[3] = "Wed"; d[4] = "Thu"; d[5] = "Fri"; d[6] = "Sat";
  return d[n];
}

module.exports = router;
