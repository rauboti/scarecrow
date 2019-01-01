// => node modules
const express = require('express');
const debug = require('debug')('app:data');

// => db connection
const sql = require('../js/db');

// => functions
const SC = require('../js/functions');

const local = module.exports = {
  get: {
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
    }
  },
  app: {
    add: async function(app, user) {
      const id = await local.getUniqueID('tblApplications');
      const result = await sql.query('INSERT INTO tblApplications (id, user, status, character_name, character_class, character_role, character_level, spec, armory, raids, preparation, asset, mistakes, anything_else) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, user, 'New', app.cName, app.cClass, app.cRole, app.cLevel, app.specLink, app.armoryLink, app.numberRaids, app.preparation, app.asset, app.mistake, app.anythingElse]);
      const character = await local.character.add(app, user, 1)
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
    add: async function(char, user, main) {
      const id = await local.getUniqueID('tblCharacter');
      const result = await sql.query('INSERT INTO tblCharacter (id, name, level, class, role, user_id, main) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, char.cName, char.cLevel, char.cClass, char.cRole, user, main]);
      return;
    },
    delete: async function(character, user) {
      const result = await sql.query('DELETE FROM tblCharacter WHERE id = ? AND user_id = ?', [character.delChar, user]);
      return;
    },
    set: {
      main: async function(character, user) {
        const reset = await sql.query('UPDATE tblCharacter SET main = ? WHERE user_id = ?', [0, user]);
        const setNew = await sql.query('UPDATE tblCharacter SET main = ? WHERE user_id = ? AND id = ?', [1, user, character])
        return;
      },
      details: async function(character, user, admin) {
        if (admin) {
          const resetMain = await sql.query('UPDATE tblCharacter SET main = ? WHERE user_id = ?', [0, user]);
          const result = await sql.query('UPDATE tblCharacter SET name = ?, level = ?, main = ? WHERE user_id = ? and id = ?', [character.cName, character.cLevel, parseInt(character.cMain), user, character.editChar])
        } else {
          const result = await sql.query('UPDATE tblCharacter SET name = ?, level = ? WHERE user_id = ? and id = ?', [character.cName, character.cLevel, user, character.editChar])
        }
        return;
      }
    }
  },
  classes: {
    getAll: async function() {
      const result = await sql.query('SELECT name, isDamage, isSupport, isTank FROM tblClass WHERE available = 1')
      return result;
    }
  },
  event: {
    add: async function(instance, date) {
      const id = await local.getUniqueID('tblEvent');
      const result = await sql.query('INSERT INTO tblEvent (id, instance, time) VALUES (?, ?, ?)', [id, instance, date]);
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
      result = await sql.query('SELECT i.name, e.time, i.tanks, i.support, i.damage FROM tblEvent e JOIN tblInstance i on i.id = e.instance WHERE e.id = ?', [id]);
      var d = new Date(result[0].time);
      event['day'] = SC.getWeekday(d.getDay());
      event['date'] = d.getDate();
      event['month'] = d.getMonth()+1;
      event['instance'] = result[0].name;
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
    items: async function(query) {
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
    add: async function(user) {
      const id = await local.getUniqueID('tblUser');
      var result = await sql.query('INSERT INTO tblUser (id, user, pw, email, rank, theme) VALUES (?, ?, ?, ?, 1, "ghostly")', [id, user.username, user.password, user.email]);
      result = await sql.query('SELECT id, user, rank, theme FROM tblUser WHERE user = ? AND pw = ?', [user.username, user.password]);
      return result[0];
    },
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
        result = await sql.query('SELECT id, name, level, class, role, main FROM tblCharacter WHERE user_id = ? ORDER BY main DESC', [user]);
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
      }
    },
    set: {
      details: async function(user, id, admin) {
        if (admin) {
          const result = await sql.query('UPDATE tblUser SET user = ?, rank = ?, role = ?, email = ? WHERE id = ?', [user.username, parseInt(user.rank), user.role, user.email, id]);
        } else {
          const result = await sql.query('UPDATE tblUser SET user = ?, email = ?, theme = ? WHERE id = ?', [user.username, user.email, user.theme, id]);
        }
        return;
      }
    }
  },
  users: {
    getOfficers: async function() {
      const result = await sql.query('SELECT u.user, r.name as "rank", u.role, c.name as "char" FROM tblUser u JOIN tblRank r ON u.rank = r.id JOIN tblCharacter c ON u.id = c.user_id WHERE u.rank > 5 AND c.main = 1 ORDER BY r.name, u.user');
      debug(result)
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
