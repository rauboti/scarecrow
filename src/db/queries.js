// => node modules
const express = require('express');
const debug = require('debug')('app:queries');

// => db connection
const sql = require('../db/config');

// => functions
const SC = require('../js/functions');

module.exports = {
    character: {
        add: async function(userId, char) {
            var charExcists = await sql.query('SELECT * from tblCharacter WHERE name = ? and server = ?', [char.name, char.server]);
            if (charExcists.length < 1) {
                const id = await getUniqueID('tblCharacter');
                await sql.query('INSERT INTO tblCharacter (id, name, server, class, spec, role, user, main, level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, char.name, char.server, char.class, char.spec, char.role, userId, 0, parseInt(char.level)]);
                return id;
            } else {
                return charExcists[0].id;
            }
        },
        delete: {
            all: async function(userId) {
                await sql.query('DELETE FROM tblCharacter WHERE user_id = ?', [userId]);
                return;
            },
            single: async function(userId, charId) {
                await sql.query('DELETE FROM tblCharacter WHERE id = ? AND user = ?', [charId, userId]);
                return;
            }
        },
        get: {
            all: async function(userId) {
                const result = await sql.query('SELECT id, name, server, class, spec, role, level, main FROM tblCharacter WHERE user = ? ORDER BY main DESC', [userId]);
                return result;
            }
        },
        update: {
            level: async function(userId, server, charName, level) {
                await sql.query('UPDATE tblCharacter SET level = ? WHERE user = ? AND server = ? AND name = ?', [level, userId, server, charName])
                return;
            },
            main: async function(userId, charId) {
                await sql.query('UPDATE tblCharacter SET main = ? WHERE user = ?', [0, userId]);
                await sql.query('UPDATE tblCharacter SET main = ? WHERE user = ? AND id = ?', [1, userId, charId])
                return;
            }
        }
    },
    classes: {
        get: async function() {
            const result = await sql.query('SELECT id, name FROM tblClass WHERE available = 1 ORDER BY id ASC')
            return result;
        }
    },
    coefficients: {
        get: async function() {
            var coefficients = {}
            const result = await sql.query('SELECT * FROM tblCoefficient');
            for (var i in result) {
                coefficients[result[i].stat] = result[i].coefficient
            }
            return coefficients;
        },
    },
    instances: {
        get: async function() {
            const result = await sql.query('SELECT id, name FROM tblInstance');
            return result;
        }
    },
    item: {
        get: {
            single: async function(itemId) {
                //console.log(itemId)
                const result = await sql.query('SELECT * FROM tblItem WHERE `id` = ?', [itemId]);
                return result;
            },
            matches: async function(query) {
                const result = await sql.query('SELECT id, name, quality, slot FROM tblItem WHERE `name` LIKE ?', ['%' + query + '%']);
                return result;
            }
        }
    },
    lv: {
        add: async function(lv) {
            await sql.query('INSERT INTO tblItem(`id`, `instance`, `name`, `slot`, `quality`, `tankvalue`, `healvalue`, `physvalue`, `magvalue`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', [parseInt(lv.id), parseInt(lv.instance), lv.name, lv.slot, lv.quality, (parseInt(lv.tanking)+parseInt(lv.tankingMisc)), (parseInt(lv.healing)+parseInt(lv.healingMisc)), (parseInt(lv.physical)+parseInt(lv.physicalMisc)), (parseInt(lv.magical)+parseInt(lv.magicalMisc))]);
            return;
        },
        update: async function(lv) {
            await sql.query('UPDATE tblItem SET `instance` = ?, `name` = ?, `slot` = ?, `quality` = ?, `tankvalue` = ?, `healvalue` = ?, `physvalue` = ?, `magvalue` = ? WHERE `id` = ?', [parseInt(lv.instance), lv.name, lv.slot, lv.quality, (parseInt(lv.tanking)+parseInt(lv.tankingMisc)), (parseInt(lv.healing)+parseInt(lv.healingMisc)), (parseInt(lv.physical)+parseInt(lv.physicalMisc)), (parseInt(lv.magical)+parseInt(lv.magicalMisc)), (parseInt(lv.id))]);
            return;
        }
    },
    user: {
        delete: async function(userId) {
            await sql.query('DELETE FROM tblUser WHERE id = ?', [userId]);
            return;
        },
        get: {
            multiple: {
                byBattletag: async function(query) {
                    const result = await sql.query('SELECT u.id, u.user as "name", r.name as "rank", u.role FROM tblUser u JOIN tblRank r on r.id = u.rank WHERE u.user LIKE ? ORDER BY u.rank DESC, u.user ASC', ['%'+query+'%']);
                    return result;
                },
                byCharacter: async function(query) {
                    const result = await sql.query('SELECT u.id, u.user as "name", r.name as "rank", u.role FROM tblUser u JOIN tblRank r on r.id = u.rank JOIN tblCharacter c ON c.user = u.id WHERE c.name LIKE ? GROUP BY u.id, r.name ORDER BY u.rank DESC, u.user ASC', ['%'+query+'%']);
                    return result;
                }
            },
            officers: async function() {
                const result = await sql.query('SELECT u.user, r.name as "rank", u.role, c.name as "char" FROM tblUser u JOIN tblRank r ON u.rank = r.id JOIN tblCharacter c ON u.id = c.user WHERE u.rank > 5 AND c.main = 1 ORDER BY r.name, u.user');
                return result;
            },
            single: {
                details: async function(userId) {
                    const result = await sql.query('SELECT u.user as "name", u.rank, r.name as "rankName", u.email, u.role, u.theme FROM tblUser u JOIN tblRank r ON u.rank = r.id WHERE u.id = ?', [userId]);
                    return result[0];
                }
            }
        },
    },
    wishlist: {
        add: async function(charId, item) {
            const id = await getUniqueID('tblWishlist');
            await sql.query('INSERT INTO tblWishlist (`id`, `char`, `item`) VALUES (?, ?, ?)', [id, charId, item]);
            return;
        },
        delete: async function (charId, id) {
            await sql.query('DELETE FROM tblWishlist WHERE `id` = ? AND `char` = ?', [id, charId]);
            return;
        },
        get: {
            single: async function(charId) {
                const result = await sql.query('SELECT wl.id, wl.item, item.slot, item.name, instance.name as "instance", item.quality FROM tblWishlist wl JOIN tblItem item ON wl.item = item.id JOIN tblInstance instance ON item.instance = instance.id WHERE wl.char = ? AND received = 0 ORDER BY item.slot ASC', [charId])
                return result;
            },
            characters: async function() {
                const result = await sql.query('SELECT c.`id`, c.`name` FROM tblWishlist wl JOIN tblCharacter c ON wl.`char` = c.`id` GROUP BY wl.`char`')
                return result;
            }
        }
    }
}

async function getUniqueID(table) {
    var id = SC.createID();
    var excists = await sql.query('SELECT * from ?? WHERE id = ?', [table, id]);
    while (excists.length !== 0) {
      id = SC.createID();
      excists = await sql.query('SELECT * from ?? WHERE id = ?', [table, id]);
    }
    return id;
  }