// => node modules
const express = require('express');
const debug = require('debug')('app:queries');
const path = require('path');

// => db connection
const sql = require('../db/config');

// => functions
const SC = require('../js/functions');

module.exports = {
    article: {
        add: async function(title, article, file) {
            const id = await getUniqueID('tblArticle');
            debug(title); debug(article); debug(file);
            if (file) {
                debug('There is an image here')
                var filename = file.image.name;
                file.image.mv(path.join(__dirname, '../../public/img/upload', filename), function(err) {
                    if (err) { debug(err); }
                    debug('Look, at least we are trying');
                })
            } else {
                debug('Damn, no images')
                var filename = '';
            }
            debug('File handled')
            await sql.query('INSERT INTO tblArticle(id, title, article, image) VALUES (?, ?, ?, ?);', [id, title, article, filename]);
            return;
        }
    },
    boss: {
        get: {
            all: async function() {
                const result = await sql.query('SELECT id, boss FROM tblProgression ORDER BY boss ASC');
                return result;
            }
        }
    },
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
            all: {
                total: async function() {
                    const result = await sql.query('SELECT id, name, server FROM tblCharacter ORDER BY name ASC');
                    return result;
                },
                user: async function(userId) {
                    const result = await sql.query('SELECT id, name, server, class, spec, role, level, main FROM tblCharacter WHERE user = ? ORDER BY main DESC', [userId]);
                    return result;
                }
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
        add: async function(item) {
            await sql.query('INSERT INTO tblItem(`id`, `instance`, `name`, `slot`, `quality`, `tankvalue`, `healvalue`, `physvalue`, `magvalue`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', [parseInt(item.id), parseInt(item.instance), item.name, item.slot, item.quality, (parseInt(item.tanking)+parseInt(item.tankingMisc)), (parseInt(item.healing)+parseInt(item.healingMisc)), (parseInt(item.physical)+parseInt(item.physicalMisc)), (parseInt(item.magical)+parseInt(item.magicalMisc))]);
            return;
        },
        award: async function(a) {
            const id = await getUniqueID('tblLoot');
            await sql.query('INSERT INTO tblLoot(`id`, `raid`, `char`, `item`, `role`, `mainspec`) VALUES(?, ?, ?, ?, ?, ?)', [id, a.raid, a.char, parseInt(a.item), a.role, parseInt(a.award)])
            return;
        },
        get: {
            all: async function() {
                const result = await sql.query('SELECT id, name, instance FROM tblItem ORDER BY name ASC');
                return result;
            },
            single: async function(itemId) {
                const result = await sql.query('SELECT * FROM tblItem WHERE `id` = ?', [itemId]);
                return result;
            },
            matches: async function(query) {
                const result = await sql.query('SELECT id, name, quality, slot FROM tblItem WHERE `name` LIKE ?', ['%' + query + '%']);
                return result;
            }
        },
        update: async function(item) {
            await sql.query('UPDATE tblItem SET `instance` = ?, `name` = ?, `slot` = ?, `quality` = ?, `tankvalue` = ?, `healvalue` = ?, `physvalue` = ?, `magvalue` = ? WHERE `id` = ?', [parseInt(item.instance), item.name, item.slot, item.quality, (parseInt(item.tanking)+parseInt(item.tankingMisc)), (parseInt(item.healing)+parseInt(item.healingMisc)), (parseInt(item.physical)+parseInt(item.physicalMisc)), (parseInt(item.magical)+parseInt(item.magicalMisc)), (parseInt(item.id))]);
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
        set: {
            details: async function(userId, details, admin) {
                if (admin) {
                    const result = await sql.query('UPDATE tblUser SET rank = ?, role = ?, email = ? WHERE id = ?', [parseInt(details.rank), details.role, details.email, userId]);
                  } else {
                    const result = await sql.query('UPDATE tblUser SET email = ?, theme = ? WHERE id = ?', [details.email, details.theme, userId]);
                  }
            }
        }
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
            },
            excisting: async function(charId, item) {
                const result = await sql.query('SELECT id FROM tblWishlist WHERE `char` = ? AND `item` = ?', [charId, item])
                return result;
            }
        },
        receive: async function(charId, id) {
            await sql.query('UPDATE tblWishlist SET `received` = 1 WHERE `id` = ? AND `char` = ?', [id, charId])
            return;
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