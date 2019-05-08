// => node modules
const express = require('express');
const debug = require('debug')('app:data');

// => db connection
const sql = require('../js/db');

// => functions
const SC = require('../js/functions');

const local = module.exports = {
  classes: {
    get: async function() {
      var classes = {}
      const result = await sql.query('SELECT id, name FROM tblClass WHERE available = 1 ORDER BY id ASC')
      for (var i in result) {
        classes[result[i].id] = result[i].name
      }
      return classes;
    }
  },
  get: {
    boss: async function(id) {
      if (id === 'all') {
        const result = await sql.query('SELECT id, boss FROM tblProgression ORDER BY boss ASC');
        return result;
      } else {
        // only 1 selected
      }
    },
    coefficients: async function() {
      var coefficients = {}
      const result = await sql.query('SELECT * FROM tblCoefficient');
      for (var i in result) {
        coefficients[result[i].stat] = result[i].coefficient
      }
      return coefficients;
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
        var result = sql.query('INSERT INTO tblAttendance (`id`, `char`, `raid`, `boss`, `points`) VALUES (?, ?, ?, ?, ?)', [id, set['selected'][player], set.raid, set.boss, 10])
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
    get: async function(id) {
      const result = await sql.query('SELECT user, status, character_name, character_class, character_role, character_level, spec, armory, raids, preparation, asset, mistakes, anything_else FROM tblApplications WHERE id = ?', [id]);
      return result;
    },
    set: async function(id, status) {
      const result = await sql.query('UPDATE tblApplications SET status = ? WHERE id = ?', [status, id])
      return;
    }
  },
  apps: {
    getAll: async function() {
      const result = await sql.query('SELECT id, status, character_name, character_class, character_role, character_level FROM tblApplications ORDER BY status DESC');
      var applications = {}
      for (var i in result) {
        if (!applications[result[i].status]) {applications[result[i].status] = []; }
        var x = {};
        x['id'] = result[i].id;
        x['name'] = result[i].character_name;
        x['class'] = result[i].character_class;
        x['role'] = result[i].character_role;
        x['level'] = result[i].character_level;
        applications[result[i].status].push(x);
      }
      return applications;
    }
  },
  character: {
    add: async function(char, user) {
      var charExcists = await sql.query('SELECT * from tblCharacter WHERE name = ? and server = ?', [char.name, char.server]);
      if (charExcists.length < 1) {
        const id = await local.getUniqueID('tblCharacter');
        await sql.query('INSERT INTO tblCharacter (id, name, server, class, spec, role, user, main, level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, char.name, char.server, char.class, char.spec, char.role, user, 0, parseInt(char.level)]);
        return id;
      } else {
        return charExcists[0].id;
      }
    },
    delete: async function(character, user) {
      await sql.query('DELETE FROM tblCharacter WHERE id = ? AND user = ?', [character, user]);
      return;
    },
    update: async function(user, server, name, level) {
      await sql.query('UPDATE tblCharacter SET level = ? WHERE user = ? AND server = ? AND name = ?', [level, user, server, name])
      return;
    },
    set: {
      main: async function(user, character) {
        await sql.query('UPDATE tblCharacter SET main = ? WHERE user = ?', [0, user]);
        await sql.query('UPDATE tblCharacter SET main = ? WHERE user = ? AND id = ?', [1, user, character])
        return;
      }
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
  instances: {
    getAll: async function() {
      const result = await sql.query('SELECT id, name FROM tblInstance')
      return result;
    }
  },
  query: {
    item: async function(query) {
      var item = await sql.query('SELECT * FROM tblItem where id = ?', [query]);
      if (item.length > 0) {
        return item[0];
      } else {
        item = {};
        var result = await sql.query('SHOW COLUMNS FROM tblItem');
        for (var i in result) {
          var type = result[i].Type.split('(')[0];
          type === 'int' && (item[result[i].Field] = 0);
          type === 'decimal' && (item[result[i].Field] = 0.0);
          type === 'char' && (item[result[i].Field] = '');
        }
        return item;
      }
    },
    items: async function(query) {
      if (query === 'all') {
        const result = await sql.query('SELECT id, name, slot, quality, instance FROM tblItem ORDER BY name ASC');
        return result;
      } else {
        const result = await sql.query('SELECT id, name, slot, quality, instance FROM tblItem WHERE name LIKE ?', ['%'+query+'%']);
        const itemlist = {}
        for (var item in result) {
          if (!itemlist[result[item].slot]) {itemlist[result[item].slot] = [];}
          var x = {}
          x['id'] = result[item].id;
          x['name'] = result[item].name;
          x['quality'] = result[item].quality;
          itemlist[result[item].slot].push(x)
        }
        return itemlist;
      }
    },
    users: async function(query) {
      const result = await sql.query('SELECT u.id, u.user as "name", r.name as "rank", u.role FROM tblUser u JOIN tblRank r on r.id = u.rank WHERE u.user LIKE ? ORDER BY u.rank DESC, u.user ASC', ['%'+query+'%']);
      return result;
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
  user: {
    delete: async function(user) {
      const deleteCharacters = await sql.query('DELETE FROM tblCharacter WHERE user_id = ?', [user]);
      const deleteUser = await sql.query('DELETE FROM tblUser WHERE id = ?', [user]);
      return;
    },
    get: {
      details: async function(user) {
        var obj = {}
        var result = await sql.query('SELECT u.user as "name", u.rank, r.name as "rankName", u.email, u.role, u.theme FROM tblUser u JOIN tblRank r ON u.rank = r.id WHERE u.id = ?', [user]);
        obj['details'] = result[0]
        result = await sql.query('SELECT id, name, server, class, spec, role, level, main FROM tblCharacter WHERE user = ? ORDER BY main DESC', [user]);
        obj['characters'] = result
        for (var char in obj['characters']) {
          if (obj['characters'][char].main === 1) {
            result = await sql.query('SELECT w.id, w.item, i.slot, i.name, i.quality FROM tblWishlist w JOIN tblItem i ON w.item = i.id WHERE char_id = ?', [obj['characters'][char].id])
            const itemlist = {}
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
        const result = await sql.query('SELECT u.user, r.name as "rank", u.role, c.name as "char" FROM tblUser u JOIN tblRank r ON u.rank = r.id JOIN tblCharacter c ON u.id = c.user WHERE u.rank > 5 AND c.main = 1 ORDER BY r.name, u.user');
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
