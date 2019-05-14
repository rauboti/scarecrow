// => node modules
const express = require('express');
const debug = require('debug')('app:scRoutes');
const passport = require('passport');
const device = require('express-device');

const pagerouter = express.Router();                  // => Defining a route

// => imports
const sql = require('../js/db');                      // => Getting database connection info
const DB = require('../js/data');                     // => interactions with the database
const SC = require('../js/functions');                // => general functions / toolbox
const api = require('../api/requests');              // => api calls to battle.net

function router() {
  pagerouter.route('/')                               // => The root page
    .get((req, res) => {
      req.user ? (rank = req.user.rank) : rank = 0;
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(rank, function(scMenu){
        (async function dbQuery() {
          const conf = { device: req.device.type.toLowerCase(), page: 'Home', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('home', {scMenu, conf});
        }())
      })})

  pagerouter.route('/admin')                          // => The admin page
    .all((req, res, next) => {
      req.user && req.user.rank >= 6 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(req.user.rank, function(scMenu){
        (async function showPage() {
          const conf = { device: req.device.type.toLowerCase(), page: 'Admin', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('admin', {scMenu, conf});
        }())
      })})
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);
        if (req.body.add) {
          if (req.body.add === 'event') {
            const Add = await DB.event.add(parseInt(req.body.instance), new Date(req.body.date), req.body.info);
            res.redirect(req.get('referer'));
          }
        }
        else if (req.body.edit) {
          if (req.body.edit === 'consumables') {
            const Edit = await DB.consumables.edit(req.body);
            res.redirect(req.get('referer'));
          }
        }
        else if (req.body.request) {
          req.body.request === 'attendance' && (result = await DB.set.attendance(req.body.set))
          req.body.request === 'itemRecipient' && (result = await DB.set.itemRecipient(req.body))
        }
      }())})

  pagerouter.route('/admin/lootvalue')                // => The loot value page
    .all((req, res, next) => {
      req.user && req.user.rank >= 6 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(req.user.rank, function(scMenu){
        (async function showPage() {
          const conf = { device: req.device.type.toLowerCase(), page: 'Admin', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('lootvalue', {scMenu, conf});
        }())
      })})
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);
        if (req.body.request) {
          req.body.request === 'lootvalue' && (result = await DB.get.lv())
        }
        res.json(result);
      }())})

  pagerouter.route('/admin/user/:id')                 // => User administration pages
    .all((req, res, next) => {
      req.user && req.user.rank === 8 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const user = await DB.user.get.details(req.params.id);
          const conf = { device: req.device.type.toLowerCase(), page: 'Admin', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('user', { scMenu, conf, user });
        }())
      })})
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);

        if (req.body.back) {
          res.redirect('/admin');
        } else if (req.body.delete) {
          if (req.body.delete === 'user') {
            const Del = await DB.user.delete(req.params.id);
            res.redirect('/admin');
          }
        } else if (req.body.editUser) {
          const Update = await DB.user.set.details(req.body, req.params.id, true)
          res.redirect(req.get('referer'));
        } else if (req.body.editChar) {
          const Edit = await DB.character.set.details(req.body, req.params.id, true)
          res.redirect(req.get('referer'));
        } else if (req.body.set) {
          if (req.body.set === 'maincharacter') {
            await DB.character.set.main(req.params.id, req.body.character);
            res.redirect(req.get('referer'));
          }
        } else if (req.body.update) {
          if (req.body.update === 'character') {
            await api.bnet.character.update(req.params.id, req.user.token, req.body.name, req.body.server);
            res.redirect(req.get('referer'));
          }
        }
      }())});

  pagerouter.route('/admin/wishlists')                // => The wishlists page
    .all((req, res, next) => {
      req.user && req.user.rank >= 6 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(req.user.rank, function(scMenu){
        (async function showPage() {
          const conf = { device: req.device.type.toLowerCase(), page: 'Admin', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('wishlists', { scMenu, conf })
        }())
      })})
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);
        if (req.body.request) {
          req.body.request === 'wishlist' && (result = await DB.get.wishlist('all'))
        }
        res.json(result);
      }())})

  pagerouter.route('/applications')                   // => applications page
    .all((req, res, next) => {
      req.user && req.user.rank >= 6 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const applications = await DB.app.get.all();
          const conf = { device: req.device.type.toLowerCase(), page: 'Applications', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('applications', { scMenu, conf, applications });
        }());
      })});

  pagerouter.route('/application/:id')                // => application page
    .all((req, res, next) => {
      req.user && req.user.rank >= 6 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          debug(req.params.id)
          const conf = { device: req.device.type.toLowerCase(), page: 'Application', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('application', { scMenu, conf });
        }());
      })})
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);
        if (req.body.request) {
          if (req.body.request === 'application') {
            data = await DB.app.get.single(req.params.id, req.user.token);
            res.json(data);
          }
        } else if (req.body.accept) {
          await DB.app.set(req.params.id, 'Accepted')
          res.redirect('/applications')
        } else if (req.body.decline) {
          await DB.app.set(req.params.id, 'Declined')
          res.redirect('/applications')
        } else if (req.body.back) {
          res.redirect('/applications')
        }
        
      }())});

  pagerouter.route('/apply')                          // => apply page
    .all((req, res, next) => {
      req.user && req.user.rank >= 1 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const conf = { device: req.device.type.toLowerCase(), page: 'Apply', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('apply', { scMenu, conf });
        }());
      })})
    .post((req, res) => {
      (async function submitApplication() {
        await DB.app.add(req.body, req.user.id);
        res.redirect('/');
      }())});

  pagerouter.route('/events')                         // => events page
    .all((req, res, next) => {
      req.user && req.user.rank >= 2 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const events = await DB.events.getAll();
          const conf = { device: req.device.type.toLowerCase(), page: 'Events', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('events', { scMenu, conf, events });
        }());
      })});

  pagerouter.route('/event/:id')                      // => event page
    .all((req, res, next) => {
      req.user && req.user.rank >= 2 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const event = await DB.event.get(req.params.id, req.user)
          const conf = { device: req.device.type.toLowerCase(), page: 'Events', rank: rank, theme: theme, main: req.user.main, title: '<Scarecrow>' }
          res.render('event', { scMenu, conf, event });
        }());
      })})
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);
        if (req.body.sign) {
          const Sign = await DB.event.response(req.params.id, req.user.main, req.body);
          res.redirect(req.get('referer'));
        }
        if (req.body.back) {
          res.redirect('/events');
        }
      }())});

  pagerouter.route('/hierarchy')                      // => hierarchy page
    .get((req, res) => {
      req.user ? rank = req.user.rank : rank = 0;
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(rank, function(scMenu){
        (async function dbQuery() {
          const officers = await DB.user.get.officers();
          const conf = { device: req.device.type.toLowerCase(), page: 'Hierarchy', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('hierarchy', { scMenu, conf, officers });
        }());
      })});

  pagerouter.route('/loot')                           // => loot page
    .all((req, res, next) => {
      req.user ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const conf = { device: req.device.type.toLowerCase(), page: 'Loot', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('sc', { scMenu, conf });
        }());
      })});

  pagerouter.route('/profile')                        // => profile page
    .all((req, res, next) => {
      req.user ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const user = await DB.user.get.details(req.user.id);
          const conf = { device: req.device.type.toLowerCase(), page: 'Profile', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('profile', { scMenu, conf, user });
        }());
      })})
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);
        if (req.body.add) {
          if (req.body.add === 'character') { const Add = await DB.character.add(req.body, req.user.id); }          
        } else if (req.body.delete) {
          if (req.body.delete === 'character') {
            await DB.character.delete(req.body.character, req.user.id);
          }
        } else if (req.body.update) {
          if (req.body.update === 'character') {
            await api.bnet.character.update(req.user.id, req.user.token, req.body.name, req.body.server);
          }
        } else if (req.body.editUser) {
          const Edit = await DB.user.set.details(req.body, req.user.id, false)
          req.user.theme = req.body.theme;
        } else if (req.body.wlAdd) {
          const Wishlist = await DB.wishlist.add(req.body.wlAdd, req.user.main);
        } else if (req.body.wlDelete) {
          const Wishlist = await DB.wishlist.delete(req.body.wlDelete, req.user.main);
        }
        res.redirect(req.get('referer'));
      }())});

  pagerouter.route('/progression')                    // => progression page
    .get((req, res) => {
      req.user ? rank = req.user.rank : rank = 0;
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(rank, function(scMenu){
        (async function dbQuery() {
          const conf = { device: req.device.type.toLowerCase(), page: 'Progression', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('progression', { scMenu, conf });
        }());
      })});

  pagerouter.route('/signIn')                         // => sign in page
    .get((req, res) => {
      req.user ? rank = req.user.rank : rank = 0;
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(rank, function(scMenu){
        (async function dbQuery() {
          const conf = { device: req.device.type.toLowerCase(), page: 'Sign in', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('signIn', { scMenu, conf });
        }());
      })});

  pagerouter.route('/signOut')                        // => sign out-function
    .get((req, res) => {
      req.logout();
      res.redirect('/');
    });

  pagerouter.route('/api/get')                        // => API
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);
        req.body.request === 'boss' && (result = await DB.get.boss(req.body.id))
        req.body.request === 'characters' && (result = await api.bnet.character.get.all(req.user.token))
        req.body.request === 'classes' && (result = await DB.classes.get())
        req.body.request === 'coefficients' && (result = await DB.get.coefficients())
        req.body.request === 'consumables' && (result = await DB.consumables.get())
        req.body.request === 'event' && (result = await DB.get.event(req.body.id))
        req.body.request === 'instances' && (result = await DB.instances.getAll())
        req.body.request === 'item' && (result = await DB.query.item(req.body.query))
        req.body.request === 'items' && (result = await DB.query.items(req.body.query))
        req.body.request === 'players' && (result = await DB.get.players())
        req.body.request === 'progression' && (result = await DB.get.progression())
        req.body.request === 'ranks' && (result = await DB.ranks.getAll())
        req.body.request === 'themes' && (result = await DB.themes.getAll())
        req.body.request === 'users' && (result = await DB.query.users(req.body.query))
        req.body.request === 'wishlist' && (result = await DB.get.wishlist(req.body.char))
        res.json(result);
      }())});

  pagerouter.route('/api/set')                        // => API
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);
        req.body.request === 'item' && (result = await DB.set.item(req.body.item))
        res.json(result);
      }())});


  return pagerouter;
}

function getPages(rank, success) {
  (async function dbQuery() {
    const result = await sql.query('SELECT id, name, path, menu FROM tblPages WHERE rank_id <= ?', [rank]);
    let scMenu = {};
    for (var i in result) {
      let obj = {};
      obj['path'] = result[i].path;
      obj['menu'] = result[i].menu;
      obj['text'] = result[i].name;
      scMenu[result[i].id] = obj;
    }
    if (rank > 0) {
      scMenu['signin'].menu = 0;
    }
    if (rank > 1) {
      scMenu['apply'].menu = 0;
    }
    success(scMenu);
  }());
}

module.exports = router;
