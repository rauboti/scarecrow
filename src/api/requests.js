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
                    url = 'https://eu.api.blizzard.com/wow/character/' + server + '/' + name + '?fields=progress&locale=en_EU&access_token=' + token;

                    var response = await getData(url);
                    return response;
                }
            },
            update: async function(user, token, name, server) {
                url = 'https://eu.api.blizzard.com/wow/character/' + server + '/' + name + '?fields=stats&locale=en_EU&access_token=' + token;

                var response = await getData(url);
                await DB.character.update(user, server, name, parseInt(response.level))
                return;
            }
        }
    }
}

const getData = async url => {
    try {
        const response = await axios.get(url);
        const data = response.data;
        return data;
        //console.log(data)
    } catch (error) {
        debug(error)
    }
}