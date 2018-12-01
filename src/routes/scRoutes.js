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

function router() {
  pagerouter.route('/')                               // => The root page
    .get((req, res) => {
      req.user ? (rank = req.user.rank) : rank = 0;
      req.user ? theme = req.user.theme : theme = 'ghostly';
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
      req.user ? theme = req.user.theme : theme = 'ghostly';
      getPages(req.user.rank, function(scMenu){
        (async function showPage() {
          const conf = { device: req.device.type.toLowerCase(), page: 'Admin', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('admin', {scMenu, conf});
        }())
      })})
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);
        if (req.body.add && req.body.add === 'event') {
          const Add = await DB.event.add(parseInt(req.body.instance), new Date(req.body.date));
          res.redirect(req.get('referer'));
        }
      }())})

  pagerouter.route('/admin/user/:id')                 // => User administration pages
    .all((req, res, next) => {
      req.user && req.user.rank === 8 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'ghostly';
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

        if (req.body.add && req.body.add === 'character') {
          const Add = await DB.character.add(req.body, req.params.id, 0);
          res.redirect(req.get('referer'));
        } else if (req.body.back) {
          res.redirect('/admin');
        } else if (req.body.delete && req.body.delete === 'character') {
          const Del = await DB.character.delete(req.body, req.user.id)
          res.redirect(req.get('referer'));
        } else if (req.body.delete && req.body.delete === 'user') {
          const Del = await DB.user.delete(req.params.id);
          res.redirect('/admin');
        } else if (req.body.editUser) {
          const Update = await DB.user.set.details(req.body, req.params.id, true)
          res.redirect(req.get('referer'));
        } else if (req.body.editChar) {
          const Edit = await DB.character.set.details(req.body, req.user.id, true)
          res.redirect(req.get('referer'));
        }
      }())});

  pagerouter.route('/applications')                   // => applications page
    .all((req, res, next) => {
      req.user && req.user.rank >= 6 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'ghostly';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const applications = await DB.apps.getAll();
          const conf = { device: req.device.type.toLowerCase(), page: 'Applications', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('applications', { scMenu, conf, applications });
        }());
      })});

  pagerouter.route('/application/:id')                // => application page
    .all((req, res, next) => {
      req.user && req.user.rank >= 6 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'ghostly';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const application = await DB.app.get(req.params.id);
          const conf = { device: req.device.type.toLowerCase(), page: 'Application', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('application', { scMenu, conf, application });
        }());
      })})
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);
        req.body.accept && (result = await DB.app.set(req.params.id, 'Accepted'))
        req.body.decline && (result = await DB.app.set(req.params.id, 'Declined'))
        res.redirect('/applications')
      }())});

  pagerouter.route('/apply')                          // => apply page
    .all((req, res, next) => {
      req.user && req.user.rank >= 1 ? next() : res.redirect('/signUp') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'ghostly';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const classes = await DB.classes.getAll();
          const conf = { device: req.device.type.toLowerCase(), page: 'Apply', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('apply', { scMenu, conf, classes });
        }());
      })})
    .post((req, res) => {
      (async function submitApplication() {
        const Add = await DB.app.add(req.body, req.user.id);
        res.redirect('/');
      }())});

  pagerouter.route('/events')                         // => events page
    .all((req, res, next) => {
      req.user && req.user.rank >= 2 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'ghostly';
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
      req.user ? theme = req.user.theme : theme = 'ghostly';
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
        if (req.body.accept) {
          const Sign = await DB.event.attend(req.params.id, req.user.main);
          res.redirect(req.get('referer'));
        }
        if (req.body.back) {
          res.redirect('/events');
        }
      }())});

  pagerouter.route('/hierarchy')                      // => hierarchy page
    .get((req, res) => {
      req.user ? rank = req.user.rank : rank = 0;
      req.user ? theme = req.user.theme : theme = 'ghostly';
      getPages(rank, function(scMenu){
        (async function dbQuery() {
          const officers = await DB.users.getOfficers();
          const conf = { device: req.device.type.toLowerCase(), page: 'Hierarchy', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('hierarchy', { scMenu, conf, officers });
        }());
      })});

  pagerouter.route('/loot')                           // => loot page
    .all((req, res, next) => {
      req.user ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'ghostly';
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
      req.user ? theme = req.user.theme : theme = 'ghostly';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const user = await DB.user.get.details(req.user.id);
          /*
          const itemid = 16802;
          var url = 'https://classic.wowhead.com/item=' + itemid + '&xml';
          SC.xmlToJson(url, function(err, data) {
            if (err) { return console.err(err); }
            //const t = JSON.stringify(data, null, 2);
            (async function parseData(){
              const name = data['wowhead']['item'][0]['name'][0]
              const quality = data['wowhead']['item'][0]['quality'][0]['_']
              const link = data['wowhead']['item'][0]['link'][0]
              const json = JSON.parse('{' + data['wowhead']['item'][0]['jsonEquip'][0] + '}')
              debug(json)
              var item = {}
              json.armor && (item['armor']=json.armor)
              json.int && (item['int']=json.int)
              json.spi && (item['spi']=json.spi)
              json.sta && (item['sta']=json.sta)
              json.splpwr && (item['spellpower']=json.splpwr)
              json.splhitpct && (item['spellhit']=json.splhitpct)
              json.manargn && (item['mp5']=json.manargn)
              json.firres && (item['fireres']=json.firres)
              debug(item)
              const updateDB = await sql.query('UPDATE tblItem set stats = ? WHERE id = ?', [JSON.stringify(item), itemid])
            }());
          });
          */
          const conf = { device: req.device.type.toLowerCase(), page: 'Profile', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('profile', { scMenu, conf, user });
        }());
      })})
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);
        if (req.body.add && req.body.add === 'character') {
          const Add = await DB.character.add(req.body, req.user.id, 0)
        } else if (req.body.delete) {
          const Delete = await DB.character.delete(req.body, req.user.id)
        } else if (req.body.editChar) {
          const Edit = await DB.character.set.details(req.body, req.user.id, false)
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
      req.user ? theme = req.user.theme : theme = 'ghostly';
      getPages(rank, function(scMenu){
        (async function dbQuery() {
          const progression = await DB.progression.get();
          const conf = { device: req.device.type.toLowerCase(), page: 'Progression', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('progression', { scMenu, conf, progression });
        }());
      })});

  pagerouter.route('/signIn')                         // => sign in page
    .get((req, res) => {
      req.user ? rank = req.user.rank : rank = 0;
      req.user ? theme = req.user.theme : theme = 'ghostly';
      getPages(rank, function(scMenu){
        (async function dbQuery() {
          const conf = { device: req.device.type.toLowerCase(), page: 'Sign in', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('signIn', { scMenu, conf });
        }());
      })})
    .post(passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/signIn'
    }));

  pagerouter.route('/signUp')                         // => sign up page
    .get((req, res) => {
      req.user ? rank = req.user.rank : rank = 0;
      req.user ? theme = req.user.theme : theme = 'ghostly';
      getPages(rank, function(scMenu){
        (async function dbQuery() {
          const conf = { device: req.device.type.toLowerCase(), page: 'Sign in', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('signUp', { scMenu, conf });
        }());
      })})
    .post((req, res) => {
      (async function addUser() {
        const user = await DB.user.add(req.body);
        req.login(user, () => {
          res.redirect('/apply');
        });
      }())});

  pagerouter.route('/api/get')                        // => API
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);
        req.body.request === 'classes' && (result = await DB.classes.getAll())
        req.body.request === 'instances' && (result = await DB.instances.getAll())
        req.body.request === 'items' && (result = await DB.query.items(req.body.query))
        req.body.request === 'ranks' && (result = await DB.ranks.getAll())
        req.body.request === 'themes' && (result = await DB.themes.getAll())
        req.body.request === 'users' && (result = await DB.query.users(req.body.query))
        res.json(result);
      }())});

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

module.exports = router;
