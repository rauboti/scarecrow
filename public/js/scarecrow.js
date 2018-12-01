var scarecrow = {
  get: {
    character: {
      classes: function(classes) { // --|--@ Complete
        //=<>= Getting available character classes, and their available roles, from the database to populate dropdownmenus
        var data = { request: 'classes' };
        $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/get', success: classes });
      }
    },
    instances: function(instances) { // --|--@ Complete
      //=<>= Getting instances from the database
      var data = { request: 'instances' };
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/get', success: instances });
    },
    items: function(query, items) { // --|--@ Complete
      // Getting items from the database
      var data = { request: 'items', query: query}
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/get', success: items });
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
    users: function(query, users) {
      //Getting users from the database
      var data = { request : 'users', query: query };
      $.ajax({ type: 'POST', data: JSON.stringify(data), contentType: 'application/json', url: location.origin + '/api/get', success: users})
    }
  },
  validate: {
    access: {
      signIn: function() {

        //=<>= Validating the sign in-form, returning false with error codes if username and/or password has not been put
        var userValid = true;
        var pwValid = true;
        $('.text-error')
          .removeClass('col-90')
          .removeClass('is-inline');
        $('#usernameError').html('');
        $('#passwordError').html('');
        if ($('#username').val() === '') {
          $('#usernameError')
            .html('Username required')
            .addClass('col-90')
            .addClass('is-inline');
          userValid = false;
        }
        if ($('#password').val() === '') {
          $('#passwordError')
            .html('Password required')
            .addClass('col-90')
            .addClass('is-inline');
          pwValid = false;
        }
        if (!userValid || !pwValid) {
          return false
        } else {
          return true;
        }
      },
      signUp: function() {

        //=<>= Validating the sign up-form, returning false with error codes if username and/or password & confirm password has not been put
        let userValid = true;
        let pwValid = true;
        $('.text-error').removeClass('col-90');
        $('.text-error').removeClass('is-inline');
        $('#usernameError').html('')
        if ($('#username').val().length < 3) {
          $('#usernameError').html('Username with at least 3 characters required');
          $('#usernameError').addClass('col-90');
          $('#usernameError').addClass('is-inline');
          userValid = false;
        }
        if ($('#password').val() === '') {
          $('#passwordError').html('Password required');
          $('#passwordError').addClass('col-90');
          $('#passwordError').addClass('is-inline');
          pwValid = false;
        } else if ($('#password').val() !== $('#password_confirm').val()) {
          $('#passwordError').html('The passwords must match each other');
          $('#passwordError').addClass('col-90');
          $('#passwordError').addClass('is-inline');
          $('#passwordConfirmError').html('The passwords must match each other');
          $('#passwordConfirmError').addClass('col-90');
          $('#passwordConfirmError').addClass('is-inline');
          pwValid = false;
        }
        if (!userValid || !pwValid) {
          return false
        } else {
          return true;
        }
      },
    },
    application: function() {

      //=<>= Validating the apply-form, returning false with error codes if one of the fields has not been put
      $('#frmCharName').val() === '' ? $('#frmCharName').addClass('invalid') : $('#frmCharName').removeClass('invalid');
      $('#frmCharName').val() === '' ? $('#frmCharNameError').html('Field required') : $('#frmCharNameError').html('');
      $('#frmCharClass option:selected').text() === '' ? $('#frmCharClass').addClass('invalid') : $('#frmCharClass').removeClass('invalid');
      $('#frmCharClass option:selected').text() === '' ? $('#frmCharClassError').html('Field required') : $('#frmCharClassError').html('');
      $('#frmCharRole option:selected').text() === '' ? $('#frmCharRole').addClass('invalid') : $('#frmCharRole').removeClass('invalid');
      $('#frmCharRole option:selected').text() === '' ? $('#frmCharRoleError').html('Field required') : $('#frmCharRoleError').html('');
      $('#frmLevel').val() === ''? $('#frmLevel').addClass('invalid') : $('#frmLevel').removeClass('invalid');
      $('#frmLevel').val() === '' ? $('#frmLevelError').html('Field required') : $('#frmLevelError').html('');
      $('#frmSpecLink').val() === '' ? $('#frmSpecLink').addClass('invalid') : $('#frmSpekLink').removeClass('invalid');
      $('#frmSpecLink').val() === '' ? $('#frmSpecLinkError').html('Field required') : $('#frmSpecLinkError').html('');
      $('#frmArmoryLink').val() === '' ? $('#frmArmoryLink').addClass('invalid') : $('#frmArmoryLink').removeClass('invalid');
      $('#frmArmoryLink').val() === '' ? $('#frmArmoryLinkError').html('Field required') : $('#frmArmoryLinkError').html('');
      $('#frmNumberOfRaids').val() === '' ? $('#frmNumberOfRaids').addClass('invalid') : $('#frmNumberOfRaids').removeClass('invalid');
      $('#frmNumberOfRaids').val() === '' ? $('#frmNumberOfRaidsError').html('Field required') : $('#frmNumberOfRaidsError').html('');
      $('#frmPreparation').val() === '' ? $('#frmPreparation').addClass('invalid') : $('#frmPreparation').removeClass('invalid');
      $('#frmPreparation').val() === '' ? $('#frmPreparationError').html('Field required') : $('#frmPreparationError').html('');
      $('#frmValuableAsset').val() === '' ? $('#frmValuableAsset').addClass('invalid') : $('#frmValuableAsset').removeClass('invalid');
      $('#frmValuableAsset').val() === '' ? $('#frmValuableAssetError').html('Field required') : $('#frmValuableAssetError').html('');
      $('#frmMakingMistake').val() === '' ? $('#frmMakingMistake').addClass('invalid') : $('#frmMakingMistake').removeClass('invalid');
      $('#frmMakingMistake').val() === '' ? $('#frmMakingMistakeError').html('Field required') : $('#frmMakingMistakeError').html('');
      $('#frmAnythingElse').val() === '' ? $('#frmAnythingElse').addClass('invalid') : $('#frmAnythingElse').removeClass('invalid');
      $('#frmAnythingElse').val() === '' ? $('#frmAnythingElseError').html('Field required') : $('#frmAnythingElseError').html('');

      if ($('#frmCharName').val() === '' || $('#frmCharClass option:selected').text() === '' || $('#frmCharRole option:selected').text() === '' || $('#frmLevel').val() === '' || $('#frmSpecLink').val() === '' || $('#frmArmoryLink').val() === '' || $('#frmNumberOfRaids').val() === '' || $('#frmPreparation').val() === '' || $('#frmValuableAsset').val() === '' || $('#frmMakingMistake').val() === '' || $('#frmAnythingElse').val() === '') {
        return false;
      } else {
        return true;
      }
    },
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
    event: {
      add: function() {
        if (clicked === 'Confirm') {
          //scarecrow.validate.highlight.event.add();
          if ($('#frmDate').val() === '' || $('#frmInstance option:selected').text() === '') {
            return false;
          } else {
            return true;
          }
        } else if (clicked === 'Decline') {
          scarecrow.window.toggle.background();
          scarecrow.window.close.popup();
          return false;
        }
      }
    },
    item: {
      add: function() {
        console.log(clicked)
        if (clicked.split('_')[0] === 'Add') {
          return true;
        } else if (clicked === 'Decline') {
          scarecrow.window.toggle.background();
          scarecrow.window.close.popup();
        }
        return false;
      }
    },
    highlight: {
      access: {

      },
      character: {
        add: function() {
          $('#frmCharName').val() === '' ? $('#frmCharName').addClass('invalid') : $('#frmCharName').removeClass('invalid');
          $('#frmCharName').val() === '' ? $('#frmCharNameError').html('Field required') : $('#frmCharNameError').html('');
          $('#frmCharLevel').val() === '' ? $('#frmCharLevel').addClass('invalid') : $('#frmCharLevel').removeClass('invalid');
          $('#frmCharLevel').val() === '' ? $('#frmCharLevelError').html('Field required') : $('#frmCharLevelError').html('');
          $('#frmCharClass option:selected').text() === '' ? $('#frmCharClass').addClass('invalid') : $('#frmCharClass').removeClass('invalid');
          $('#frmCharClass option:selected').text() === '' ? $('#frmCharClassError').html('Field required') : $('#frmCharClassError').html('');
          $('#frmCharRole option:selected').text() === '' ? $('#frmCharRole').addClass('invalid') : $('#frmCharRole').removeClass('invalid');
          $('#frmCharRole option:selected').text() === '' ? $('#frmCharRoleError').html('Field required') : $('#frmCharRoleError').html('');
        }
      },
      event: {
        add: function() {
          $('#frmDate').val() === '' ? $('#frmDate').addClass('invalid') : $('#frmDate').removeClass('invalid');
          $('#frmDate').val() === '' ? $('#frmDateError').html('Field required') : $('#frmDateError').html('');
          $('#frmInstance option:selected').text() === '' ? $('#frmInstance').addClass('invalid') : $('#frmInstance').removeClass('invalid');
          $('#frmInstance option:selected').text() === '' ? $('#frmInstanceError').html('Field required') : $('#frmInstanceError').html('');
        }
      }
    },
    user: {
      delete: function() {  // --|--@ Complete
        if (clicked === 'Confirm') {
          return true;
        } else if (clicked === 'Decline') {
          scarecrow.window.toggle.background();
          scarecrow.window.close.popup();
          return false;
        }
      },
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
    },
    quickmenu: function() {  // --|--@ Complete
      if (clicked === 'Back') {
        return true;
      } else if (clicked === 'Delete') {
        scarecrow.window.toggle.background();
        scarecrow.window.user.delete($('#txtUsername').text());
        return false;
      }
    }
  },
  window: {
    character: {
      add: function() {  // --|--@ Complete
        $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.character.add();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
        + '<div class="popupContainer-headline">Add new character</div>'
        + '<div class="popupContainer-body">'
        + '<div class="popupContainer-row">'
        + '<div class="popupContainer-rowPrompt">Name</div>'
        + '<div class="popupContainer-rowValue"><input id="frmCName" type="text" name="cName" class="input-full" autocomplete="off" /></div>'
        + '</div>'
        + '<div class="popupContainer-row">'
        + '<div class="popupContainer-rowPrompt">Level</div>'
        + '<div class="popupContainer-rowValue"><input id="frmCLevel" type="text" name="cLevel" class="input-full" autocomplete="off" /></div>'
        + '</div>'
        + '<div class="popupContainer-row">'
        + '<div class="popupContainer-rowPrompt">Class</div>'
        + '<div class="popupContainer-rowValue"><select id="frmCClass" name="cClass" class="input-full"></select></div>'
        + '</div>'
        + '<div class="popupContainer-row">'
        + '<div class="popupContainer-rowPrompt">Role</div>'
        + '<div class="popupContainer-rowValue"><select id="frmCRole" name="cRole" class="input-full"></select></div>'
        + '</div>'
        + '</div>'
        + '<div class="popupContainer-row">'
        + '<button id="btnDecline" type="submit" name="back" value="back" class="popupContainer-button icon-decline"></button>'
        + '<button id="btnConfirm" type="submit" name="add" value="character" class="popupContainer-button icon-accept"></button>'
        + '</div>'
        + '</div></form>');

        scarecrow.get.character.classes(initClasses);
        function initClasses(classes) {
          for (var i in classes) {
            $('#frmCClass').append('<option>' + classes[i].name + '</option>')
          }
          initRoles();
          //Change role dropdown if the Class-dropdown changes
          $('#frmCClass').change(function() {
            initRoles();
          });
          function initRoles() {
            $('#frmCRole').html('');
            for (var i in classes) {
              if (classes[i].name === $('#frmCClass :selected').text()) {
                classes[i].isDamage !== 0 ? $('#frmCRole').append('<option>Damage</option>') : '';
                classes[i].isSupport !== 0 ? $('#frmCRole').append('<option>Support</option>') : '';
                classes[i].isTank !== 0 ? $('#frmCRole').append('<option>Tank</option>') : '';
              }
            }
          }
        }

        $('.popupContainer-button').click(function() {
          clicked = $(this).attr('id').split('btn')[1];
        });

        //$('.input-full').change(function() {
        //  scarecrow.validate.highlight.character.add();
        //});
      },
      delete: function(charID) { // --|--@ Complete
        $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.character.delete();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
        + '<div class="popupContainer-headline">Delete character</div>'
        + '<div class="popupContainer-body">'
        + '<div class="popupContainer-row">Are you sure you want to delete <font color="red">' + $('#txtCName_' + charID).html() + '</font>? All character data will be purged!</div>'
        + '</div>'
        + '<div class="popupContainer-row">'
        + '<button id="btnDecline" type="submit" name="back" value="back" class="popupContainer-button icon-decline"></button>'
        + '<button id="btnConfirm" type="submit" name="delete" value="' + charID + '" class="popupContainer-button icon-accept"></button>'
        + '</div>'
        + '</div></form>');

        $('.popupContainer-button').click(function() {
          clicked = $(this).attr('id').split('btn')[1];
        });
      },
      edit: function(admin, charID, main) { // --|--@ Complete
        $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.character.edit();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
        + '<div class="popupContainer-headline">Edit character</div>'
        + '<div class="popupContainer-body">'
        + '<div class="popupContainer-row">'
        + '<div class="popupContainer-rowPrompt">Name</div>'
        + '<div class="popupContainer-rowValue"><input id="frmCName" type="text" name="cName" class="input-full" value="' + $('#txtCName_' + charID).html() + '" autocomplete="off" /></div>'
        + '</div>'
        + '<div class="popupContainer-row">'
        + '<div class="popupContainer-rowPrompt">Level</div>'
        + '<div class="popupContainer-rowValue"><input id="frmCLevel" type="text" name="cLevel" class="input-full" value="' + $('#txtCLevel_' + charID).html() + '" autocomplete="off" /></div>'
        + '</div>'
        + '</div>'
        + '<div class="popupContainer-row">'
        + '<button id="btnDecline" type="submit" name="back" value="back" class="popupContainer-button icon-decline"></button>'
        + '<button id="btnConfirm" type="submit" name="editChar" value="' + charID + '" class="popupContainer-button icon-accept"></button>'
        + '</div>'
        + '</div></form>');

        if (admin) {
          $('.popupContainer-body').append('<div class="popupContainer-row"><div class="popupContainer-rowPrompt"></div><div class="popupContainer-rowValue"><select id="frmMain" name="cMain" class="input-full"></select></div></div>');
          if (main == 1) {
            $('#frmMain').append('<option value="1" selected>Main</option><option value="0">Alt</option>')
          } else {
            $('#frmMain').append('<option value="1">Main</option><option value="0" selected>Alt</option>')
          }
        }

        $('.popupContainer-button').click(function() {
          clicked = $(this).attr('id').split('btn')[1];
        });
      }
    },
    close: {
      popup: function() {
        $('#frmPopup').remove();
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
              $('#itemList').append('<a href="https://classic.wowhead.com/item=' + response[slot][item].id + '/" target="_blank"><div class="itemContainer clr-'+ response[slot][item].quality +'"><strong>'+response[slot][item].name+'</strong></div></a><button id="btnAdd_' + response[slot][item].id + '" type="submit" name="wlAdd" value="' + response[slot][item].id + '" class="itemList-button icon-add"></button>')
            }
          }
          $('.itemList-button').click(function() {
            clicked = $(this).attr('id').split('btn')[1];
          });
        }
      }
    },
    event: {
      add: function() {
        $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.event.add();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
        + '<div class="popupContainer-headline">Add new event</div>'
        + '<div class="popupContainer-body">'
        + '<div class="popupContainer-row">'
        + '<div class="popupContainer-rowPrompt">Time</div>'
        + '<div class="popupContainer-rowValue"><input id="frmDate" type="text" name="date" class="input-full" autocomplete="off" /></div>'
        + '</div>'
        + '<div class="popupContainer-row">'
        + '<div class="popupContainer-rowPrompt">Instance</div>'
        + '<div class="popupContainer-rowValue"><select id="frmInstance" name="instance" class="input-full"></select></div>'
        + '</div>'
        + '</div>'
        + '<div class="popupContainer-row">'
        + '<button id="btnDecline" type="submit" name="back" value="back" class="popupContainer-button icon-decline"></button>'
        + '<button id="btnConfirm" type="submit" name="add" value="event" class="popupContainer-button icon-accept"></button>'
        + '</div>'
        + '</div></form>');

        scarecrow.get.instances(initInstances);
        function initInstances(instances) {
          $('#frmInstance').html('<option selected></option>');
          for (var i in instances) {
            $('#frmInstance').append('<option value="' + instances[i].id + '">' + instances[i].name + '</option>')
          }
        }
        $('.popupContainer-button').click(function() {
          clicked = $(this).attr('id').split('btn')[1];
        });
        $('#frmDate').datepicker({timepicker:'true', language:'en', dateFormat:'D M dd yyyy'});
      }
    },
    toggle: {
      background: function() {
        $('menu').toggleClass('inactive');
        $('.container-page').toggleClass('inactive');
      }
    },
    user: {
      delete: function(username) { // --|--@ Complete
        $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.character.delete();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
        + '<div class="popupContainer-headline">Delete user</div>'
        + '<div class="popupContainer-body">'
        + '<div class="popupContainer-row">Are you sure you want to delete <font color="red">' + username + '</font>? All user and character data will be purged!</div>'
        + '</div>'
        + '<div class="popupContainer-row">'
        + '<button id="btnDecline" type="submit" name="back" value="back" class="popupContainer-button icon-decline"></button>'
        + '<button id="btnConfirm" type="submit" name="delete" value="user" class="popupContainer-button icon-accept"></button>'
        + '</div>'
        + '</div></form>');

        $('.popupContainer-button').click(function() {
          clicked = $(this).attr('id').split('btn')[1];
        });
      },
      edit: function(admin, username, email, theme, rank, role) { // --|--@ Complete
        $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.user.edit();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
        + '<div class="popupContainer-headline">Edit general information</div>'
        + '<div class="popupContainer-body">'
        + '<div class="popupContainer-row">'
        + '<div class="popupContainer-rowPrompt">Username</div>'
        + '<div class="popupContainer-rowValue"><input id="frmUsername" type="text" name="username" class="input-full" value="' + username + '" autocomplete="off" /></div>'
        + '</div>'
        + '<div class="popupContainer-row">'
        + '<div class="popupContainer-rowPrompt">Email</div>'
        + '<div class="popupContainer-rowValue"><input id="frmEmail" type="text" name="email" class="input-full" value="' + email + '" autocomplete="off" /></div>'
        + '</div>'
        + '</div>'
        + '<div class="popupContainer-row">'
        + '<button id="btnDecline" type="submit" name="back" value="back" class="popupContainer-button icon-decline"></button>'
        + '<button id="btnConfirm" type="submit" name="editUser" value="general" class="popupContainer-button icon-accept"></button>'
        + '</div>'
        + '</div></form>');

        if (admin) {
          $('.popupContainer-body').append('<div class="popupContainer-row"><div class="popupContainer-rowPrompt">Rank</div><div class="popupContainer-rowValue"><select id="frmRank" name="rank" class="input-full"></select></div></div><div class="popupContainer-row"><div class="popupContainer-rowPrompt">Role</div><div class="popupContainer-rowValue"><input id="frmRole" type="text" name="role" class="input-full" value="' + role + '" autocomplete="off" /></div></div>');
          scarecrow.get.ranks(initRanks);
          function initRanks(ranks) {
              for (var i in ranks) {
                if (ranks[i].name === rank) {
                  $('#frmRank').append('<option value="' + ranks[i].id + '" selected>' + ranks[i].name + '</option>');
                } else {
                  $('#frmRank').append('<option value="' + ranks[i].id + '">' + ranks[i].name + '</option>');
                }
              }
          }
        } else {
          $('.popupContainer-body').append('<div class="popupContainer-row"><div class="popupContainer-rowPrompt">Theme</div><div class="popupContainer-rowValue"><select id="frmTheme" name="theme" class="input-full"></select></div></div>');
          scarecrow.get.themes(initThemes);
          function initThemes(themes) {
            for (var i in themes) {
              if (themes[i].name.toLowerCase() === theme.toLowerCase()) {
                $('#frmTheme').append('<option value="' + themes[i].name.toLowerCase() + '" selected>' + themes[i].name + '</option>')
              } else {
                $('#frmTheme').append('<option value="' + themes[i].name.toLowerCase() + '">' + themes[i].name + '</option>')
              }
            }
          }
        }

        $('.popupContainer-button').click(function() {
          clicked = $(this).attr('id').split('btn')[1];
        });
      }
    }
  }
}
