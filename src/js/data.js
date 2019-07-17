// => node modules
const express = require('express');
const debug = require('debug')('app:data');

// => db connection
const sql = require('../db/config');
const db = require('../db/queries');

// => functions
const SC = require('../js/functions');

// => APIs
const api = require('../api/requests');

const local = module.exports = {
  character: {
    add: async function(userId, char) {
      const id = await db.character.add(userId, char)
      return id;
    },
    delete: async function(userId, charId) {
      await db.character.delete.single(userId, charId);
      return;
    },
    update: {
      level: async function(userId, token, charName, server) {
        level = await api.bnet.character.get.level(token, charName, server);
        await db.character.update.level(userId, server, charName, level)
        return;
      },
      main: async function(userId, charId) {
        await db.character.update.main(userId, charId)
      }
    }
  },
  classes: {
    get: async function() {
      var classes = {}
      const result = await db.classes.get();
      for (var i in result) {
        classes[result[i].id] = result[i].name
      }
      return classes;
    }
  },
  instances: {
    get: async function() {
      const result = db.instances.get();
      return result;
    }
  },
  item: {
    get: async function(req) {
      req.source === 'wowhead' ? item = await api.wh.item(req.id) : item = await db.item.get(req.id);
      item['coefficients'] = await db.coefficients.get();
      return item;
    }
  },
  user: {
    delete: async function(userId) {
      await db.character.delete.all(userId);
      await db.user.delete(userId);
      return;
    },
    get: {
      name: async function(query, set) {
        if (set === 'battletag') {
          const result = await db.user.get.multiple.byBattletag(query);
          return result;
        } else if (set === 'character') {
          const result = await db.user.get.multiple.byCharacter(query);
          return result;
        }
      },
      details: async function(userId) {
        var obj = {}
        obj['details'] = await db.user.get.single.details(userId)
        obj['characters'] = await db.character.get.all(userId);
        for (var char in obj['characters']) {
          if (obj['characters'][char].main === 1) {
            result = await db.wishlist.get(obj['characters'][char].id);
            var itemlist = {}
            for (var item in result) {
              if (!itemlist[result[item].slot]) {itemlist[result[item].slot] = [];}
              var x = {}
              x['id'] = result[item].id;
              x['item'] = result[item].item;
              x['name'] = result[item].name;
              x['quality'] = result[item].quality;
              itemlist[result[item].slot].push(x)
            }
            obj['wishlist'] = itemlist
          }
        }
        return obj;
      },
      officers: async function() {
        const result = await db.user.get.officers();
        return result;
      }
    },
    set: {
      details: async function(user, id, admin) {
        if (admin) {
          const result = await sql.query('UPDATE tblUser SET rank = ?, role = ?, email = ? WHERE id = ?', [parseInt(user.rank), user.role, user.email, id]);
        } else {
          const result = await sql.query('UPDATE tblUser SET email = ?, theme = ? WHERE id = ?', [user.email, user.theme, id]);
        }
        return;
      }
    }
  },
  lootValue: {
    update: async function(lv) {
      if (lv.id !== '') {
        const item = await db.item.get(lv.id)
        item.length < 1 ? await db.lv.add(lv) : await db.lv.update(lv)
      }
      return;
    }
  },




  // => Still require cleanup
  get: {
    boss: async function(id) {
      if (id === 'all') {
        const result = await sql.query('SELECT id, boss FROM tblProgression ORDER BY boss ASC');
        return result;
      } else {
        // only 1 selected
      }
    },
    event: async function(id) {
      if (id === 'all') {
        const result = await sql.query('SELECT e.id, i.name, e.time FROM tblEvent e JOIN tblInstance i ON e.instance = i.id');
        return result;
      } else {
        // only 1 selected
      }
    },
    lv: async function() {
      var lv = [];
      var attendance = {};
      var received = {};
      var items = {};

      var result = await sql.query('SELECT id, tankvalue, healvalue, physvalue, magvalue FROM tblItem ORDER BY id')
      for (var i in result) {
        var set = {}
        set['tank'] = result[i].tankvalue;
        set['heal'] = result[i].healvalue;
        set['phys'] = result[i].physvalue;
        set['mag'] = result[i].magvalue;
        items[result[i].id] = set
      }

      result = await sql.query('SELECT c.id, a.char, a.raid, a.boss, c.name, c.class FROM tblAttendance a JOIN tblCharacter c ON a.char = c.id ORDER BY a.char, a.raid')
      for (var i in result) {
        if (!(result[i].char in attendance)) {
          var set = {}
          set['id'] = result[i].id
          set['player'] = result[i].name;
          set['class'] = result[i].class;
          set['attendance'] = 0;
          attendance[result[i].char] = set;
        }
        attendance[result[i].char]['attendance']++;
      }

      result = await sql.query('SELECT `raid`, `char`, `role`, `item` FROM tblItemReceived ORDER BY `char`, `raid`')
      for (var i in result) {
        !(result[i].char in received) && (received[result[i].char] = 0);
        received[result[i].char] += parseInt(items[result[i].item][result[i].role])
      }

      for (var i in attendance) {
        var set = {}
        set['id'] = attendance[i].id
        set['player'] = attendance[i].player
        set['class'] = attendance[i].class
        received[i] && received[i] !== 0 ? set['value'] = (received[i] / attendance[i].attendance).toFixed(2) : set['value'] = (1 / attendance[i].attendance).toFixed(2)
        lv.push(set)
      }

      lv.sort(function(a, b){
          return a.value-b.value
      })

      return lv;
    },
    players: async function() {
      var players = [];
      const result = await sql.query('SELECT id, name, class FROM tblCharacter WHERE main = 1')
      for (var i in result) {
        set = {};
        set['id'] = result[i].id
        set['name'] = result[i].name
        set['class'] = result[i].class
        players.push(set)
      }
      return players;
    },
    progression: async function() {
      var progression = {}
      const result = await sql.query('SELECT instance, boss, status FROM tblProgression');
      for (var i in result) {
        var x = {};
        !(result[i].instance in progression) && (progression[result[i].instance] = []);
        x['name'] = result[i].boss;
        x['status'] = result[i].status;
        progression[result[i].instance].push(x);
      }
      return progression;
    },
    wishlist: async function(char) {
      var wl = {}
      if (char === 'allfixed') {
        var result = await sql.query('SELECT c.name as "char", i.name as "item", i.id FROM tblWishlist wl JOIN tblCharacter c ON c.id = wl.char_id JOIN tblItem i ON wl.item = i.id')
        //var result = await sql.query('SELECT c.name FROM tblWishlist wl JOIN tbl')
        for (var i in result) {
          !(result[i].char in wl) && (wl[result[i].char] = []);
          var set = {}
          set['id'] = result[i].id;
          set['name'] = result[i].item;
          wl[result[i].char].push(set); 
        }
        return wl;
      } else if (char === 'all') {
        var result = await sql.query('SELECT char_id, item FROM tblWishlist')
      } else {
        var result = await sql.query('SELECT char_id, item FROM tblWishlist WHERE char_id = ?', [char])
      }
      for (var i in result) {
        !(result[i].char_id in wl) && (wl[result[i].char_id] = []);
        wl[result[i].char_id].push(result[i].item)
      }
      return wl;
    }
  },
  set: {
    attendance: async function(set) {
      for (var player in set['selected']) {
        var id = await local.getUniqueID('tblAttendance');
        var result = await sql.query('INSERT INTO tblAttendance (`id`, `char`, `raid`, `boss`, `points`) VALUES (?, ?, ?, ?, ?)', [id, set['selected'][player], set.raid, set.boss, 10])
      }
      return;
    },
    item: async function(item) {
      var result = await sql.query('SELECT * from tblItem WHERE id = ?', [item.id])
      if (result.length < 1) {
        result = await sql.query('INSERT INTO tblItem (`id`, `instance`, `name`, `slot`, `quality`, `agi`, `int`, `spi`, `sta`, `str`, `ap`, `rap`, `defense`, `parry`, `dodge`, `block`, `mp5`, `splpwr`, `hlrpwr`, `dps`, `melcrit`, `melhit`, `splcrit`, `splhit`, `misc`, `tankvalue`, `healvalue`, `physvalue`, `magvalue`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [item.id, item.instance, item.name, item.slot, item.quality, item.agi, item.int, item.spi, item.sta, item.str, item.ap, item.rap, item.defense, item.parry, item.dodge, item.block, item.mp5, item.splpwr, item.hlrpwr, item.dps, item.melcrit, item.melhit, item.splcrit, item.splcrit, item.misc, item.valuetank, item.valueheal, item.valuephysical, item.valuemagical])
      } else {
        result = await sql.query('UPDATE tblItem SET `instance` = ?, `name` = ?, `slot` = ?, `quality` = ?, `agi` = ?, `int` = ?, `spi` = ?, `sta` = ?, `str` = ?, `ap` = ?, `rap` = ?, `defense` = ?, `parry` = ?, `dodge` = ?, `block` = ?, `mp5` = ?, `splpwr` = ?, `hlrpwr` = ?, `dps` = ?, `melcrit` = ?, `melhit` = ?, `splcrit` = ?, `splhit` = ?, `misc` = ?, `tankvalue` = ?, `healvalue` = ?, `physvalue` = ?, `magvalue` = ? WHERE `id` = ?', [item.instance, item.name, item.slot, item.quality, item.agi, item.int, item.spi, item.sta, item.str, item.ap, item.rap, item.defense, item.parry, item.dodge, item.block, item.mp5, item.splpwr, item.hlrpwr, item.dps, item.melcrit, item.melhit, item.splcrit, item.splcrit, item.misc, item.valuetank, item.valueheal, item.valuephysical, item.valuemagical, item.id])
      }
      return;
    },
    itemRecipient: async function(set) {
      var id = await local.getUniqueID('tblItemReceived');
      var result = await sql.query('INSERT INTO tblItemReceived (`id`, `raid`, `char`, `item`, `role`) VALUES (?, ?, ?, ?, ?)', [id, set.raid, set.player, set.item, set.role])
    }
  },
  app: {
    add: async function(app, user) {
      const char = await local.character.add(app, user)
      const id = await local.getUniqueID('tblApplications');
      await sql.query('INSERT INTO tblApplications (`id`, `user`, `status`, `character`, `raids`, `prep`, `why`) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, parseInt(user), 'New', char, app.raids, app.prep, app.why]);
      return;
    },
    get: {
      all: async function() {
        const result = await sql.query('SELECT `a`.`id`, `a`.`status`, `c`.`name`, `c`.`class`, `c`.`role`, `c`.`level`, `c`.`spec` FROM tblApplications a JOIN tblCharacter c ON `a`.`character` = `c`.`id` ORDER BY `a`.`status` DESC');
        var applications = {}
        for (var i in result) {
          if (!applications[result[i].status]) {applications[result[i].status] = []; }
          var x = {};
          x['id'] = result[i].id;
          x['name'] = result[i].name;
          x['class'] = result[i].class;
          x['role'] = result[i].role;
          x['level'] = result[i].level;
          x['spec'] = result[i].spec;
          applications[result[i].status].push(x);
        }
        return applications;
      },
      single: async function(id, token) {
        var app = {}
        
        //Getting application data from database
        var result = await sql.query('SELECT `a`.`user`, `a`.`status`, `c`.`name`, `c`.`server`, `c`.`class`, `c`.`role`, `c`.`level`, `c`.`spec`, `a`.`raids`, `a`.`prep`, `a`.`why` FROM tblApplications a JOIN tblCharacter c ON `a`.`character` = `c`.`id` WHERE `a`.`id` = ?', [id]);
        app['general'] = result[0]

        // Adding current gear
        app['items'] = {}
        result = await api.bnet.character.get.gear(token, app.general.name, app.general.server);
        for (var i in result['items']) {
          if (typeof result['items'][i] === 'object' && result['items'][i] !== null) {
            set = {}
            set['name'] = result['items'][i].name;
            set['id'] = result['items'][i].id;
            app['items'][i] = set;
          } else {
            debug(i)
          }
        }

        // Adding current progression
        app['progress'] = {}
        result = await api.bnet.character.get.progress(token, app.general.name, app.general.server);
        var included = ['Ahn\'Qiraj Temple', 'Blackwing Lair', 'Naxxramas', 'Onyxia\'s Lair', 'Molten Core', 'Ruins of Ahn\'Qiraj']
        for (var raid in result['progression']['raids']) {
          if (included.includes(result['progression']['raids'][raid].name)) {
            var instance = {}
            for (var boss in result['progression']['raids'][raid]['bosses']) {
              var set = {}
              if ('normalKills' in result['progression']['raids'][raid]['bosses'][boss]) { set['normal'] = result['progression']['raids'][raid]['bosses'][boss].normalKills; }
              if ('heroicKills' in result['progression']['raids'][raid]['bosses'][boss]) { set['heroic'] = result['progression']['raids'][raid]['bosses'][boss].heroicKills; }
              if ('mythicKills' in result['progression']['raids'][raid]['bosses'][boss]) { set['mythic'] = result['progression']['raids'][raid]['bosses'][boss].mythicKills; }
              instance[result['progression']['raids'][raid]['bosses'][boss].name] = set;
            }
            app['progress'][result['progression']['raids'][raid].name] = instance;
          }
        }

        return app;
      }
    },
    set: async function(id, status) {
      const result = await sql.query('UPDATE tblApplications SET status = ? WHERE id = ?', [status, id])
      return;
    }
  },
  consumables: {
    edit: async function(obj) {
      debug(obj);
      debug(obj.list);
      debug(parseInt(obj.instance));
      debug(obj.instance);
      const result = await sql.query('UPDATE tblConsumables SET list = ? WHERE id = ?', [obj.list, parseInt(obj.instance)]);
      return;
    },
    get: async function() {
      const list = {}
      const result = await sql.query('SELECT i.id, i.name, c.list FROM tblConsumables c JOIN tblInstance i ON i.id = c.id');
      for (var i in result) {
        var obj = {};
        obj['instance'] = result[i].name;
        result[i].list !== null ? obj['list'] = result[i].list : obj['list'] = '';
        list[result[i].id] = obj;
      }
      return list;
    }
  },
  event: {
    add: async function(instance, date, info) {
      const id = await local.getUniqueID('tblEvent');
      const result = await sql.query('INSERT INTO tblEvent (id, instance, time, info) VALUES (?, ?, ?, ?)', [id, instance, date, info]);
      return;
    },
    response: async function(event, main, response) {
      response.comment ? comment = response.comment : comment = '';
      const id = await local.getUniqueID('tblEventSignup');
      const excists = await sql.query('SELECT * FROM tblEventSignup WHERE event_id = ? AND char_ID = ?', [event, main]);
      if (excists[0]) {
        const result = await sql.query('UPDATE tblEventSignup SET event_status = ?, comment = ?, timestamp = now() WHERE event_id = ? AND char_id = ?', [response.sign, comment, event, main])
      } else {
        const result = await sql.query('INSERT INTO tblEventSignup (id, event_id, char_id, event_status, comment) VALUES (?, ?, ?, ?, ?)', [id, event, main, response.sign, comment])
      }
      return;
    },
    get: async function(id, user) {
      var event = {}
      var result = await sql.query('SELECT id FROM tblCharacter WHERE user_id = ? AND main = 1', [user.id])
      result[0] && (user.main = result[0].id)
      result = await sql.query('SELECT i.name, e.time, i.tanks, i.support, i.damage, c.list, e.info FROM tblEvent e JOIN tblInstance i ON i.id = e.instance JOIN tblConsumables c ON i.id = c.id WHERE e.id = ?', [id]);
      var d = new Date(result[0].time);
      event['day'] = SC.getWeekday(d.getDay());
      event['date'] = d.getDate();
      event['month'] = d.getMonth()+1;
      event['instance'] = result[0].name;
      event['consumables'] = result[0].list;
      (result[0].info !== null) && (event['info'] = result[0].info);
      event['tank'] = [];
      event['support'] = [];
      event['damage'] = [];
      event['uninvolved'] = [];
      event['max'] = {};
      event['max']['tanks'] = result[0].tanks
      event['max']['support'] = result[0].support
      event['max']['damage'] = result[0].damage
      var signed = false;
      result = await sql.query('SELECT c.id, es.event_status, c.name, c.class, c.role, es.comment FROM tblEventSignup es JOIN tblCharacter c on c.id = es.char_id WHERE event_id = ? ORDER BY timestamp ASC', [id]);
      var idx = 1;
      for (var i in result) {
        (result[i].id === user.main) && (signed = result[i].event_status)
        var attendee = {}
        attendee['class'] = result[i].class
        attendee['name'] = result[i].name
        attendee['status'] = result[i].event_status
        if (result[i].event_status === 'accept') {
          attendee['idx'] = idx;
          event[result[i].role.toLowerCase()].push(attendee);
          idx++;
        } else {
          attendee['comment'] = result[i].comment
          event['uninvolved'].push(attendee)
        }
      }
      event['signed'] = signed;
      return event;
    }
  },
  events: {
    getAll: async function() {
      var events = {}
      const result = await sql.query('SELECT e.id, i.name, e.time FROM tblEvent e JOIN tblInstance i on i.id = e.instance WHERE e.time >= CURDATE() ORDER BY e.time ASC');
      for (var i in result) {
        d = new Date(result[i].time)
        var x = {}
        x['id'] = result[i].id;
        x['instance'] = result[i].name;
        x['day'] = SC.getWeekday(d.getDay());
        x['date'] = d.getDate();
        x['month'] = d.getMonth()+1;
        events[i] = x;
      }
      return events;
    }
  },
  ranks: {
    getAll: async function() {
      const result = await sql.query('SELECT * FROM tblRank')
      return result;
    }
  },
  themes: {
    getAll: async function() {
      const result = await sql.query('SELECT * FROM tblTheme')
      return result;
    }
  },
  wishlist: {
    add: async function(item, char) {
      const id = await local.getUniqueID('tblWishlist');
      const result = await sql.query('INSERT INTO tblWishlist (id, char_id, item) VALUES (?, ?, ?)', [id, char, parseInt(item)]);
      return;
    },
    delete: async function(item, char) {
      const result = await sql.query('DELETE FROM tblWishlist WHERE id = ? AND char_id = ?', [item, char]);
    }
  },
  getUniqueID: async function(table) {
    var id = SC.createID();
    var excists = await sql.query('SELECT * from ?? WHERE id = ?', [table, id]);
    while (excists.length !== 0) {
      id = SC.createID();
      excists = await sql.query('SELECT * from ?? WHERE id = ?', [table, id]);
    }
    return id;
  }
}
