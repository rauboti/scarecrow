// => node modules
const express = require('express');
const debug = require('debug')('app:scRoutes');
const passport = require('passport');
const device = require('express-device');
const fileUpload = require('express-fileupload');

const pagerouter = express.Router();                  // => Defining a route

// => imports
const sql = require('../db/config');                      // => Getting database connection info
const data = require('../js/data');                   // => interactions with the database
const SC = require('../js/functions');                // => general functions / toolbox
const api = require('../api/requests');              // => api calls to battle.net

function router() {
  pagerouter.route('/')                               // => The root page
    .get((req, res) => {
      req.user ? (rank = req.user.rank) : rank = 0;
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(rank, function(scMenu){
        (async function dbQuery() {
          const articles = await data.article.get.all();
          const conf = { device: req.device.type.toLowerCase(), page: 'Home', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('home', {scMenu, conf, articles});
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
            await data.event.add(parseInt(req.body.instance), new Date(req.body.date), req.body.info);
            res.redirect(req.get('referer'));
          }
        }
        else if (req.body.edit) {
          if (req.body.edit === 'consumables') {
            const Edit = await data.consumables.edit(req.body);
            res.redirect(req.get('referer'));
          }
        }
        else if (req.body.request) {
          req.body.request === 'attendance' && (result = await data.set.attendance(req.body.set))
          req.body.request === 'itemRecipient' && (result = await data.set.itemRecipient(req.body))
        }
      }())})

  pagerouter.route('/admin/articles')                   // => applications page
    .all((req, res, next) => {
      req.user && req.user.rank >= 6 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const conf = { device: req.device.type.toLowerCase(), page: 'Admin', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('articles', { scMenu, conf });
        }());
      })})
    .post((req, res) => {
      (async function dbQuery() {
        if (req.body.action === 'new') { await data.article.add(req.body.title, req.body.article, req.files); }
        res.redirect(req.get('referer'));
      }())});

  pagerouter.route('/admin/article/:id')                   // => applications page
    .all((req, res, next) => {
      req.user && req.user.rank >= 6 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          
          const conf = { device: req.device.type.toLowerCase(), page: 'Admin', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('article', { scMenu, conf });
        }());
      })});

  pagerouter.route('/admin/attendance')                   // => attendance page
    .all((req, res, next) => {
      req.user && req.user.rank >= 6 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const events = await data.event.get.all('all');
          const bosses = await data.boss.get.all();
          const characters = await data.character.get.all.mains();
          const conf = { device: req.device.type.toLowerCase(), page: 'Admin', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('attendance', { scMenu, conf, events, bosses, characters });
        }());
      })})
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body)
        await data.attendance.add(req.body);
        res.redirect(req.get('referer'));
      }())});

  pagerouter.route('/admin/user/:id')                 // => User administration pages
    .all((req, res, next) => {
      req.user && req.user.rank === 8 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const user = await data.user.get.details(req.params.id);
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
            const Del = await data.user.delete(req.params.id);
            res.redirect('/admin');
          }
        } else if (req.body.editUser) {
          const Update = await data.user.set.details(req.params.id, req.body, true)
          res.redirect(req.get('referer'));
        } else if (req.body.editChar) {
          const Edit = await data.character.set.details(req.body, req.params.id, true)
          res.redirect(req.get('referer'));
        } else if (req.body.set) {
          if (req.body.set === 'maincharacter') {
            await data.character.update.main(req.params.id, req.body.character);
            res.redirect(req.get('referer'));
          }
        } else if (req.body.update) {
          if (req.body.update === 'character') {
            await data.character.update.level(req.params.id, req.user.token, req.body.name, req.body.server);
            res.redirect(req.get('referer'));
          }
        }
      }())});

  pagerouter.route('/applications')                   // => applications page
    .all((req, res, next) => {
      req.user && req.user.rank >= 6 ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const applications = await data.app.get.all();
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
            data = await data.app.get.single(req.params.id, req.user.token);
            res.json(data);
          }
        } else if (req.body.accept) {
          await data.app.set(req.params.id, 'Accepted')
          res.redirect('/applications')
        } else if (req.body.decline) {
          await data.app.set(req.params.id, 'Declined')
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
        await data.app.add(req.body, req.user.id);
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
          const events = await data.event.get.all('current');
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
          const event = await data.event.get.single(req.params.id, req.user)
          const conf = { device: req.device.type.toLowerCase(), page: 'Events', rank: rank, theme: theme, main: req.user.main, title: '<Scarecrow>' }
          res.render('event', { scMenu, conf, event });
        }());
      })})
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);
        if (req.body.sign) {
          const Sign = await data.event.response(req.params.id, req.user.main, req.body);
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
          const officers = await data.user.get.officers();
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
          const items = await data.item.get.all();
          //const lootValue = await data.lootValue.get();
          const conf = { device: req.device.type.toLowerCase(), page: 'Loot', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('loot', { scMenu, conf, items });
        }());
      })});

  pagerouter.route('/loot/award')                     // => The item award page
  .all((req, res, next) => {
    req.user && req.user.rank >= 6 ? next() : res.redirect('/signIn') })
  .get((req, res) => {
    req.user && (rank = req.user.rank);
    req.user ? theme = req.user.theme : theme = 'scarecrow';
    getPages(req.user.rank, function(scMenu){
      (async function showPage() {
        const characters = await data.character.get.all.total();
        const items = await data.item.get.all();
        const events = await data.event.get.all('all');
        const conf = { device: req.device.type.toLowerCase(), page: 'Loot', rank: rank, theme: theme, title: '<Scarecrow>' }
        res.render('awarditem', {scMenu, conf, characters, items, events});
      }())
    })})
  .post((req, res) => {
    (async function dbQuery() {
      debug(req.body);
      await data.loot.add(req.body);
      res.redirect(req.get('referer'));
    }())})
  
  pagerouter.route('/loot/standings')                // => The standings page
  .all((req, res, next) => {
    req.user && req.user.rank >= 6 ? next() : res.redirect('/signIn') })
  .get((req, res) => {
    req.user && (rank = req.user.rank);
    req.user ? theme = req.user.theme : theme = 'scarecrow';
    getPages(req.user.rank, function(scMenu){
      (async function showPage() {
        const conf = { device: req.device.type.toLowerCase(), page: 'Loot', rank: rank, theme: theme, title: '<Scarecrow>' }
        res.render('lootstandings', {scMenu, conf});
      }())
    })})
  .post((req, res) => {
    (async function dbQuery() {
      debug(req.body);
      if (req.body.request) {
        req.body.request === 'lootvalue' && (result = await data.get.lv())
      }
      res.json(result);
    }())})

  pagerouter.route('/loot/update')                // => The item value page
  .all((req, res, next) => {
    req.user && req.user.rank >= 8 ? next() : res.redirect('/signIn') })
  .get((req, res) => {
    req.user && (rank = req.user.rank);
    req.user ? theme = req.user.theme : theme = 'scarecrow';
    getPages(req.user.rank, function(scMenu){
      (async function showPage() {
        const conf = { device: req.device.type.toLowerCase(), page: 'Loot', rank: rank, theme: theme, title: '<Scarecrow>' }
        const instances = await data.instances.get();
        res.render('itemupdate', {scMenu, conf, instances});
      }())
    })})
  .post((req, res) => {
    (async function dbQuery() {
      debug(req.body);
      if (req.body.update && req.body.update === 'itemvalue') {
        await data.item.update(req.body)
        res.redirect(req.get('referer'));
      }
    }())})
  
  pagerouter.route('/loot/wishlists')                // => The wishlists page
  .all((req, res, next) => {
    req.user && req.user.rank >= 6 ? next() : res.redirect('/signIn') })
  .get((req, res) => {
    req.user && (rank = req.user.rank);
    req.user ? theme = req.user.theme : theme = 'scarecrow';
    getPages(req.user.rank, function(scMenu){
      (async function showPage() {
        const wishlists = await data.wishlist.get.characters();
        const conf = { device: req.device.type.toLowerCase(), page: 'Loot', rank: rank, theme: theme, title: '<Scarecrow>' }
        res.render('wishlists', { scMenu, conf, wishlists})
      }())
    })})
  .post((req, res) => {
    (async function dbQuery() {
      debug(req.body);
      
      res.json(result);
    }())})

  pagerouter.route('/profile')                        // => profile page
    .all((req, res, next) => {
      req.user ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const user = await data.user.get.details(req.user.id);
          const conf = { device: req.device.type.toLowerCase(), page: 'Profile', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('profile', { scMenu, conf, user });
        }());
      })})
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);
        if (req.body.add) {
          if (req.body.add === 'character') { const Add = await data.character.add(req.user.id, req.body); }          
        } else if (req.body.delete) {
          if (req.body.delete === 'character') {
            await data.character.delete(req.user.id, req.body.character);
          }
        } else if (req.body.update) {
          if (req.body.update === 'character') {
            await data.character.update.level(req.user.id, req.user.token, req.body.name, req.body.server);
          }
        } else if (req.body.editUser) {
          const Edit = await data.user.set.details(req.user.id, req.body, false)
          req.user.theme = req.body.theme;
        }
        res.redirect(req.get('referer'));
      }())});
  
  pagerouter.route('/profile/wishlist')               // => profile wishlist page
    .all((req, res, next) => {
      req.user ? next() : res.redirect('/signIn') })
    .get((req, res) => {
      req.user && (rank = req.user.rank);
      req.user ? theme = req.user.theme : theme = 'scarecrow';
      getPages(req.user.rank, function(scMenu){
        (async function dbQuery() {
          const wishlist = await data.wishlist.get.single(req.user.main);
          const conf = { device: req.device.type.toLowerCase(), page: 'Profile', rank: rank, theme: theme, title: '<Scarecrow>' }
          res.render('wishlist', { scMenu, conf, wishlist });
        }());
      })})
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);
        req.body.add && await data.wishlist.add(req.user.main, req.body.add)
        req.body.delete && await data.wishlist.delete(req.user.main, req.body.delete)
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

    pagerouter.route('/api/item/:action')             // => Item API
    .post((req, res) => {
      (async function endPoints() {
        //debug(req.params.action)
        //debug(req.body);
        req.params.action === 'single' &&  (result = await data.item.get.single(req.body))
        req.params.action === 'matches' && (result = await data.item.get.matches(req.body.query))
        res.json(result);
      }())});

    pagerouter.route('/api/wishlist/:character')      // => Wishlist API
    .post((req, res) => {
      (async function endPoints() {
        //debug(req.params.character)
        req.params.character === 'items' ? result = await data.wishlist.get.items() : result = await data.wishlist.get.single(req.params.character)
        res.json(result);
      }())});
    
    pagerouter.route('/api/lootvalue/get')            // => LootValue API
    .post((req, res) => {
      (async function endPoints() {
        //debug(req.body)
        result = await data.lootValue.get();
        res.json(result);
      }())});

  pagerouter.route('/api/get')                        // => API
    .post((req, res) => {
      (async function dbQuery() {
        debug(req.body);
        req.body.request === 'boss' && (result = await data.boss.get.all())
        req.body.request === 'characters' && (result = await api.bnet.character.get.all(req.user.token))
        req.body.request === 'classes' && (result = await data.classes.get())
        req.body.request === 'coefficients' && (result = await data.get.coefficients())
        req.body.request === 'consumables' && (result = await data.consumables.get())
        req.body.request === 'instances' && (result = await data.instances.get())
        req.body.request === 'players' && (result = await data.get.players())
        req.body.request === 'progression' && (result = await data.get.progression())
        req.body.request === 'ranks' && (result = await data.ranks.getAll())
        req.body.request === 'themes' && (result = await data.themes.getAll())

        // => new ones
        if (req.body.request === 'user') { result = await data.user.get.name(req.body.query, req.body.set); }
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
