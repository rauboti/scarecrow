var scarecrow = {
  get: {
    application: function(app) {
      var data = { request: 'application' };
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: window.location.href, success: app })
    },
    boss: function(id, boss) {
      var data = { request: 'boss', id: id };
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/get', success: boss })
    },
    classes: function(classes) { // --|--@ Complete
      //=<>= Getting available character classes, and their available roles, from the database to populate dropdownmenus
      var data = { request: 'classes' };
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/get', success: classes });
    },
    characters: function(characters){
      var data = { request: 'characters' };
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/get', success: characters })
    },
    coefficients: function(coefficients) {
      var data = { request: 'coefficients' };
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/get', success: coefficients })
    },
    consumables: function(consumables) {
      var data = { request: 'consumables' };
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/get', success: consumables })
    },
    event: function(id, events) {
      var data = { request: 'event', id: id };
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/get', success: events })
    },
    instances: function(instances) { // --|--@ Complete
      //=<>= Getting instances from the database
      var data = { request: 'instances' };
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/get', success: instances });
    },
    item: {
      single: function(id, src, item) {
        // Getting items from the database
        var data = { request: 'item', source: src, id: id}
        $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/item/single', success: item });
      },
      matches: function(query, items) { // --|--@ Complete
        // Getting items from the database
        var data = { request: 'items', query: query}
        $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/item/matches', success: items });
      }
    },
    lootValue: function(lootvalue) { // --|--@ Complete
      // Getting items from the database
      var data = { request: 'lootvalue' }
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/admin/lootvalue', success: lootvalue });
    },
    players: function(players) {
      // Getting progression status from the database
      var data = { request: 'players' }
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/get', success: players });
    },
    progression: function(progression) {
      // Getting progression status from the database
      var data = { request: 'progression' }
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/get', success: progression });
    },
    ranks: function(ranks) { // --|--@ Complete
      //=<>= Getting available guild ranks from the database
      var data = { request: 'ranks' };
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/get', success: ranks });
    },
    themes: function(themes) { // --|--@ Complete
      //Getting available themes from the database
      var data = { request: 'themes' };
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/get', success: themes });
    },
    users: function(query, qs, users) {
      //Getting users from the database
      var data = { request : 'user', query: query, set: qs };
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/get', success: users})
    },
    wishlist: function(char, wishlist) {
      //Getting users from the database
      $.ajax({ type: 'POST', contentType: 'application/json', url: location.origin + '/api/wishlist/' + char, success: wishlist})
    }
  },
  set: {
    attendance: function(set) {
      // Adding attendance to selected players
      var data = { request: 'attendance', set: set}
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/admin'});
    },
    item: function(item) {
      // Setting item information
      var data = { request: 'item', item: item}
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/set'});
    },
    itemRecipient: function(raid, item, player, role) {
      // Adding an item to a player
      var data = { request: 'itemRecipient', raid: raid, item: item, player: player, role: role}
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/admin'});
    },
    lv: function(lv) {
      // Adding LootValue score to the database
      var data = { request: 'lootValue', lv: lv}
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/admin'});
    }
  },
  validate: {
    character: {
      add: function() { // --|--@ Complete
        //=<>= Validation while adding new character
        if (clicked === 'Confirm') {
          //Confirming the character details, validating the input
          //scarecrow.validate.highlight.character.add();
          if ($('#frmCName').val() === '' || $('#frmCLevel').val() === '') {
            return false;
          } else {
            return true;
          }
        } else if (clicked === 'Decline') {
          //Declining the character
          scarecrow.window.toggle.background();
          scarecrow.window.close.popup();
          return false;
        }
      },
      delete: function() { // --|--@ Complete
        if (clicked === 'Confirm') {
          return true;
        } else if (clicked === 'Decline') {
          scarecrow.window.toggle.background();
          scarecrow.window.close.popup();
          return false;
        }
      },
      edit: function() {
        if (clicked === 'Confirm') {
          return true;
        } else if (clicked === 'Decline') {
          scarecrow.window.toggle.background();
          scarecrow.window.close.popup();
          return false;
        }
      }
    },
    item: {
      add: function() {
        if (clicked.split('_')[0] === 'Add') {
          return true;
        } else if (clicked === 'Decline') {
          scarecrow.window.toggle.background();
          scarecrow.window.close.popup();
        }
        return false;
      }
    },
    user: {
      edit: function() {  // --|--@ Complete
        if (clicked === 'Confirm') {
          var frmComplete = true;
          $('#frmUsername').val() === '' ? frmComplete = false : frmComplete = true;
          return frmComplete;
        } else if (clicked === 'Decline') {
          scarecrow.window.toggle.background();
          scarecrow.window.close.popup();
          return false;
        }
      }
    }
  },
  window: {
    close: {
      popup: function() {
        $('#frmPopup').remove();
      },
      other: function(item) {
        $(item).remove();
      }
    },
    item: {
      add: function() { // --|--@ Complete
        $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.item.add();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
        + '<div class="popupContainer-headline">Add to wishlist</div>'
        + '<div class="popupContainer-body">'
        + '<div class="popupContainer-row"><input id="txtItemSearch" type="text" name="item" class="input-themed col-80" placeholder="Type to search.." autocomplete="off" /></div>'
        + '</div>'
        + '<div class="popupContainer-row"><div id="itemList" class="itemList"></div></div>'
        + '<div class="popupContainer-row">'
        + '<button id="btnDecline" type="submit" name="back" value="back" class="popupContainer-button icon-decline"></button>'
        + '</div>'
        + '</div></form>');

        $('.popupContainer-button').click(function() {
          clicked = $(this).attr('id').split('btn')[1];
        });
        //gets available instances and sends the callback to a callback-function
        scarecrow.get.instances(initInstances)
        var searchTimer;
        $('#txtItemSearch').keyup(function() {
          clearTimeout(searchTimer)
          var query = this.value;
          searchTimer = setTimeout(function() {
            if (query.length > 4) {
              scarecrow.get.items(query, initItems);
            }
          }, 300);
        });
        var instances;
        //Handles the callback from the instances query
        function initInstances(response) { instances = response; }
        //Handles the callback from the items query
        function initItems(response) {
          console.log(response)
          $('#itemList').html('');
          for (var slot in response) {
            for (var item in response[slot]) {
              $('#itemList').append('<a href="https://classic.wowhead.com/item=' + response[slot][item].id + '/" target="_blank"><div class="itemContainer clr-'+ response[slot][item].quality +'"><strong>'+response[slot][item].name+'</strong></div></a><button id="btnAdd_' + response[slot][item].id + '" type="submit" name="wlAdd" value="' + response[slot][item].id + '" class="itemContainer-button icon-add"></button>')
            }
          }
          $('.itemContainer-button').click(function() {
            clicked = $(this).attr('id').split('btn')[1];
          });
        }
      }
    },
    toggle: {
      background: function() {
        $('menu').toggleClass('inactive');
        $('.pageContainer').toggleClass('inactive');
      },
      other: function(item) {
        $(item).toggleClass('inactive')
      }
    },
  }
}
