// => node modules
const express = require('express');
const debug = require('debug')('app:requests');
const axios = require('axios');

// => imports
const DB = require('../js/data');

// => requests
const local = module.exports = {
    bnet: {
        character: {
            get: {
                all: async function(token) {
                    var characters = {}
                    url = 'https://eu.api.blizzard.com/wow/user/characters?access_token=' + token;
    
                    var response = await getData(url);
                    data = response['characters'] // Blizzard returns the json named characters; this makes the code easier to read below
                    for (var char in data) {
                        !(characters[data[char].realm]) && (characters[data[char].realm] = {});
                        var set = {}
                        set['class'] = data[char].class
                        set['race'] = data[char].race
                        set['gender'] = data[char].gender
                        set['level'] = data[char].level
                        set['spec'] = data[char].spec
                        set['guild'] = data[char].guild
                        characters[data[char].realm][data[char].name] = set;
                    }
                    return characters;
                },
                gear: async function(token, name, server) {
                    url = 'https://eu.api.blizzard.com/wow/character/' + server + '/' + name + '?fields=items&locale=en_EU&access_token=' + token;

                    var response = await getData(url);
                    return response;
                },
                progress: async function(token, name, server) {
                    url = 'https://eu.api.blizzard.com/wow/character/' + server + '/' + name + '?fields=progression&locale=en_EU&access_token=' + token;

                    var response = await getData(url);
                    return response;
                },
                level: async function(token, name, server) {
                    url = 'https://eu.api.blizzard.com/wow/character/' + server + '/' + name + '?fields=stats&locale=en_EU&access_token=' + token;
                    var response = await getData(url);
                    return response.level;
                }
            }
        }
    },
    wh: {
        item: async function(id) {
            var item = {}
            var stats = {}
            stats['base'] = {}
            stats['physical'] = {}
            stats['magical'] = {}
            stats['defensive'] = {}
            stats['other'] = []
            url = 'https://classic.wowhead.com/item=' + id + '&xml'

            var res = await getData(url);

            res.includes(' Agility</span>') && (stats['base']['agi'] = parseInt(res.split(' Agility</span>')[0].split('+').slice(-1)[0]))
            res.includes(' Intellect</span>') && (stats['base']['int'] = parseInt(res.split(' Intellect</span>')[0].split('+').slice(-1)[0]))
            res.includes(' Stamina</span>') && (stats['base']['sta'] = parseInt(res.split(' Stamina</span>')[0].split('+').slice(-1)[0]))
            res.includes(' Spirit</span>') && (stats['base']['spi'] = parseInt(res.split(' Spirit</span>')[0].split('>').slice(-1)[0]))
            res.includes(' Strength</span>') && (stats['base']['str'] = parseInt(res.split(' Strength</span>')[0].split('+').slice(-1)[0]))

            res.includes('<!--dps-->') && (stats['physical']['dps'] = parseFloat(res.split('<!--dps-->(')[1].split(' damage per second')[0]))

            var e = (res.match(/Equip:/g) || []).length

            for (var i = 0; i < e; i++) {
                var t = res.split('Equip:')[i+1].split('class="q2">')[1].split('</a>')[0];
                if (t.includes(' health per 5 sec')) { stats['defensive']['hp5'] = parseInt(t.split(' health per 5 sec')[0].split(' ').slice(-1)[0]); }
                else if (t.includes(' mana per 5 sec')) { stats['magical']['mp5'] = parseInt(t.split(' mana per 5 sec')[0].split(' ').slice(-1)[0]); }
                else if (t.includes('Increases damage and healing done by magical spells and effects by')) { stats['magical']['dmg'] = parseInt(t.split('.')[0].split(' ').slice(-1)[0]); }
                else if (t.includes('Increases damage done by Shadow spells and effects ')) { stats['magical']['dmg_shadow'] = parseInt(t.split('.')[0].split(' ').slice(-1)[0]); }
                else if (t.includes('Increases damage done by Fire spells and effects ')) { stats['magical']['dmg_fire'] = parseInt(t.split('.')[0].split(' ').slice(-1)[0]); }
                else if (t.includes('Increases damage done by Frost spells and effects ')) { stats['magical']['dmg_frost'] = parseInt(t.split('.')[0].split(' ').slice(-1)[0]); }
                else if (t.includes('Increases healing done by spells and effects by')) { stats['magical']['healing'] = parseInt(t.split('.')[0].split(' ').slice(-1)[0]); }
                else if (t.includes('Improves your chance to hit with spells')) { stats['magical']['hit'] = parseInt(t.split('%')[0].split(' ').slice(-1)[0]); }
                else if (t.includes('Improves your chance to get a critical strike with spells by')) { stats['magical']['crit'] = parseInt(t.split('%')[0].split(' ').slice(-1)[0]); }
                else if (t.includes('Improves your chance to hit by')) { stats['physical']['hit'] = parseInt(t.split('%')[0].split(' ').slice(-1)[0]); }
                else if (t.includes('Improves your chance to get a critical strike by')) { stats['physical']['crit'] = parseInt(t.split('%')[0].split(' ').slice(-1)[0]); }
                else if (t.includes('Increased Defense')) { stats['defensive']['defense'] = parseInt(t.split('+')[1].split('.')[0]); }
                else if (t.includes('Increases your chance to dodge an attack by')) { stats['defensive']['dodge'] = parseInt(t.split('%')[0].split(' ').slice(-1)[0]); }
                else if (t.includes('Increases the block value of your shield by')) { stats['defensive']['block_value'] = parseInt(t.split('.')[0].split(' ').slice(-1)[0]); }
                else if (t.includes('Increases your chance to block attacks with a shield by')) { stats['defensive']['block_chance'] = parseInt(t.split('%')[0].split(' ').slice(-1)[0]); }
                else if (t.includes('Increases your chance to parry an attack')) { stats['defensive']['parry'] = parseInt(t.split('%')[0].split(' ').slice(-1)[0]); }
                else { stats['other'].push(t); }
            }
            item['stats'] = stats;
            item['id'] = id;
            item['name'] = res.split('<name><![CDATA[')[1].split(']]></name>')[0];
            item['quality'] = res.split('<quality')[1].split('</quality>')[0].split('>')[1];
            item['slot'] = res.split('<inventorySlot')[1].split('</inventorySlot>')[0].split('>')[1];

            return item
        }
    }
}

const getData = async url => {
    try {
        const response = await axios.get(url);
        const data = response.data;
        return data;
    } catch (error) {
        debug(error)
    }
}