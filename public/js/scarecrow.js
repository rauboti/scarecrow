var scarecrow = {
  get: {
    character: {
      classes: function() {

        //=<>= Getting available character classes, and their available roles, from the database to populate dropdownmenus
        var data = { request: 'getCharacterClasses' };
        $.ajax({
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
          url: location.origin + '/api',
          success: function(classes) {
            //If it succeeds, populate the dropdownmenu
            $('#frmCharClass').html('<option class="option-themed" selected></option>');
            for (var i in classes) {
              $('#frmCharClass').append('<option class="option-themed">' + classes[i].name + '</option>')
            }
            //Change role dropdown if the Class-dropdown changes
            $('#frmCharClass').change(function() {
              $('#frmCharRole').html('<option class="option-themed" selected></option>');
              for (var i in classes) {
                if (classes[i].name === $('#frmCharClass :selected').text()) {
                  classes[i].isDamage !== 0 ? $('#frmCharRole').append('<option class="option-themed">Damage</option>') : '';
                  classes[i].isSupport !== 0 ? $('#frmCharRole').append('<option class="option-themed">Support</option>') : '';
                  classes[i].isTank !== 0 ? $('#frmCharRole').append('<option class="option-themed">Tank</option>') : '';
                }
              }
            });
          }
        });
      }
    },
    instances: function() {

      //=<>= Getting instances from the database to populate dropdownmenus
      var data = { request: 'getInstances' };
      $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: location.origin + '/api',
        success: function(instances) {
          console.log(instances);
          $('#frmInstance').html('<option class="option-themed" selected></option>');
          for (var i in instances) {
            $('#frmInstance').append('<option class="option-themed" value="' + instances[i].id + '">' + instances[i].name + '</option>')
          }
        }
      });
    },
    user: {
      ranks: function(currentRank) {

        //=<>= Getting available guild ranks from the database to populate dropdownmenus
        var data = { request: 'getUserRanks' };
        $.ajax({
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
          url: location.origin + '/api',
          success: function(ranks) {
            //If it succeeds, populate the dropdownmenu
            for (var i in ranks) {
              if (ranks[i].name === currentRank) {
                //Select the rank the user already has
                $('#frmRank').append('<option value="' + ranks[i].id + '" class="option-themed" selected>' + ranks[i].name + '</option>');
              } else {
                $('#frmRank').append('<option value="' + ranks[i].id + '" class="option-themed">' + ranks[i].name + '</option>');
              }
            }
          }
        });
      }
    }
  },
  validate: {
    access: {
      signIn: function() {

        //=<>= Validating the sign in-form, returning false with error codes if username and/or password has not been put
        var userValid = true;
        var pwValid = true;
        $('.text-error').removeClass('col-90');
        $('.text-error').removeClass('is-inline');
        $('#usernameError').html('');
        $('#passwordError').html('');
        if ($('#username').val() === '') {
          $('#usernameError').html('Username required');
          $('#usernameError').addClass('col-90');
          $('#usernameError').addClass('is-inline');
          userValid = false;
        }
        if ($('#password').val() === '') {
          $('#passwordError').html('Password required')
          $('#passwordError').addClass('col-90');
          $('#passwordError').addClass('is-inline');
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
      add: function() {

        //=<>= Validation while adding new character
        if (clicked === 'ShowWindow') {
          //Opening popup for character details
          scarecrow.window.toggle.background();
          scarecrow.window.character.add('add', 'character');
        } else if (clicked === 'Confirm') {
          //Confirming the character details, validating the input
          scarecrow.validate.highlight.character.add();
          if ($('#frmCharName').val() === '' || $('#frmCharLevel').val() === '' || $('#frmCharClass option:selected').text() === '' || $('#frmCharRole option:selected').text() == '') {
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
        return false;
      },
      delete: function() {
        if (clicked.split('_')[0] === 'ShowWindow') {
          scarecrow.window.toggle.background();
          scarecrow.window.character.delete('delete', 'character', clicked.split('_')[1]);
          return false;
        } else if (clicked === 'Confirm') {
          return true;
        } else if (clicked === 'Decline') {
          scarecrow.window.toggle.background();
          scarecrow.window.close.popup();
          return false;
        }
        return false;
      },
      edit: function() {
        if (clicked.split('_')[0] === 'ShowWindow') {
          scarecrow.window.toggle.background();
          scarecrow.window.character.delete('delete', 'character', clicked.split('_')[1]);
          return false;
        } else if (clicked.split('_')[0] === 'Main') {
          return true;
        } else if (clicked === 'Confirm') {
          return true;
        } else if (clicked === 'Decline') {
          scarecrow.window.toggle.background();
          scarecrow.window.close.popup();
          return false;
        }
        return false;
      }
    },
    event: {
      add: function() {
        if (clicked === 'ShowWindow') {
          scarecrow.window.toggle.background();
          scarecrow.window.event.add('add', 'event');
        } else if (clicked === 'Confirm') {
          scarecrow.validate.highlight.event.add();
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
      delete: function() {
        console.log(clicked);
        if (clicked === 'ShowWindow') {
          scarecrow.window.toggle.background();
          scarecrow.window.user.delete($('#txtUsername').text(), 'delete', 'user');
          return false;
        } else if (clicked === 'Confirm') {
          return true;
        } else if (clicked === 'Decline') {
          scarecrow.window.toggle.background();
          scarecrow.window.close.popup();
          return false;
        }
      },
      update: function() {
        if (clicked === 'ShowWindow') {
          scarecrow.window.toggle.background();
          scarecrow.window.user.update($('#txtUsername').text(), $('#txtEmail').text(), $('#txtRank').text(), $('#txtRole').text(), 'update', 'general');
          return false;
        } else if (clicked === 'Confirm') {
          $('#frmUsername').val() === '' ? $('#frmUsername').addClass('invalid') : $('#frmUsername').removeClass('invalid');
          $('#frmUsername').val() === '' ? $('#frmUsernameError').html('Field required') : $('#frmUsernameError').html('');
          $('#frmRank').text() === '' ? $('#frmRank').addClass('invalid') : $('#frmRank').removeClass('invalid');
          $('#frmRank').text() === '' ? $('#frmRankError').html('Field required') : $('#frmRankError').html('');

          if ($('#frmUsername').val() === '' || $('#frmRank').text() === '') {
            return false;
          } else {
            return true;
          }
        } else if (clicked === 'Decline') {
          scarecrow.window.toggle.background();
          scarecrow.window.close.popup();
          return false;
        }
        return false;
      },
      userInfo: function() {
        if (clicked === 'ShowWindow') {
          scarecrow.window.toggle.background();
          scarecrow.window.user.edit($('#txtUsername').text(), $('#txtEmail').text(), 'edit', 'userInfo');
          return false;
        } else if (clicked === 'Confirm') {
          $('#frmUsername').val() === '' ? $('#frmUsername').addClass('invalid') : $('#frmUsername').removeClass('invalid');
          $('#frmUsername').val() === '' ? $('#frmUsernameError').html('Field required') : $('#frmUsernameError').html('');

          if ($('#frmUsername').val() === '') {
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
    }
  },
  window: {
    character: {
      add: function(confirmName, confirmValue) {
        $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.character.add();"><div id="popupContainer" class="container-popup"></div></form>');
        $('#popupContainer').append('<div class="container-headline">Add new character</div>'
        + '<div class="container-body">'
        + '<div class="col-90 is-inline margin-sides-5 align-top">'
        + '<div>Character name</div>'
        + '<div class="col-60 is-inline"><input id="frmCharName" type="text" name="cName" class="input-themed input-full" /></div><div id="frmCharNameError" class="text-error is-inline col-30 margin-sides-5"></div>'
        + '</div>'
        + '<div class="col-90 is-inline margin-sides-5 align-top">'
        + '<div>Character level</div>'
        + '<div class="col-60 is-inline"><input id="frmCharLevel" type="text" name="cLevel" class="input-themed input-full" /></div><div id="frmCharLevelError" class="text-error is-inline col-30 margin-sides-5"></div>'
        + '</div>'
        + '<div class="col-90 is-inline margin-sides-5 align-top">'
        + '<div>Class</div>'
        + '<div class="col-60 is-inline"><select id="frmCharClass" name="cClass" class="select-themed input-full"></select></div><div id="frmCharClassError" class="text-error is-inline col-30 margin-sides-5"></div>'
        + '</div>'
        + '<div class="col-90 is-inline margin-sides-5 align-top">'
        + '<div>Role</div>'
        + '<div class="col-60 is-inline"><select id="frmCharRole" name="cRole" class="select-themed input-full"></select></div><div id="frmCharRoleError" class="text-error is-inline col-30 margin-sides-5"></div>'
        + '</div>'
        + '</div>'
        + '<div id="frmPopupFooter" class="container-footer align-center">'
        + '</div>'
        );
        $('#frmPopupFooter').append('<button id="btnDecline" type="submit" name="back" value="back" class="button-icon-medium icon-decline submit-button margin-sides-5"></button>'
        + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '" class="button-icon-medium icon-accept submit-button margin-sides-5"></button>');
        $('.submit-button').click(function() {
          clicked = $(this).attr('id').split('btn')[1];
        });
        scarecrow.get.character.classes();
        $('.input-full').change(function() {
          scarecrow.validate.highlight.character.add();
        });
      },
      delete: function(confirmName, confirmValue, charID) {
        $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.character.delete();"><div id="popupContainer" class="container-popup"></div></form>');
        $('#popupContainer').append('<div class="container-headline">Delete character</div>'
        + '<div class="container-body">Are you sure you want to delete ' + $('#characterName_' + charID).html() + '? All character data will be purged!</div>'
        + '<div id="frmPopupFooter" class="container-footer align-center">'
        + '</div>'
        );
        $('#frmPopupFooter').append('<button id="btnDecline" type="submit" name="back" value="back" class="button-icon-medium icon-decline submit-button margin-sides-5"></button>'
        + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '_' + charID + '" class="button-icon-medium icon-accept submit-button margin-sides-5"></button>');
        $('.submit-button').click(function() {
          clicked = $(this).attr('id').split('btn')[1];
        });
      }
    },
    close: {
      popup: function() {
        $('#frmPopup').remove();
      }
    },
    event: {
      add: function(confirmName, confirmValue) {
        $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.event.add();"><div id="popupContainer" class="container-popup"></div></form>');
        $('#popupContainer').append('<div class="container-headline">Add new event</div>'
        + '<div class="container-body">'
        + '<div class="col-90 is-inline margin-sides-5 align-top">'
        + '<div>Time</div>'
        + '<div class="col-70 is-inline"><input id="frmDate" type="text" name="date" class="input-themed input-full" /></div><div id="frmDateError" class="text-error is-inline col-30 margin-sides-5"></div>'
        + '</div>'
        + '<div class="col-90 is-inline margin-sides-5 align-top">'
        + '<div>Instance</div>'
        + '<div class="col-70 is-inline"><select id="frmInstance" name="instance" class="select-themed input-full"></select></div><div id="frmInstanceError" class="text-error is-inline col-30 margin-sides-5"></div>'
        + '</div>'
        + '</div>'
        + '<div id="frmPopupFooter" class="container-footer align-center">'
        + '</div>'
        );
        $('#frmPopupFooter').append('<button id="btnDecline" type="submit" name="back" value="back" class="button-icon-medium icon-decline submit-button margin-sides-5"></button>'
        + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '" class="button-icon-medium icon-accept submit-button margin-sides-5"></button>');
        scarecrow.get.instances();
        $('.submit-button').click(function() {
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
      delete: function(user, confirmName, confirmValue) {
        $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.user.userInfo();"><div id="popupContainer" class="container-popup"></div></form>');
        $('#popupContainer').append('<div class="container-headline">Delete character</div>'
        + '<div class="container-body">Are you sure you want to delete ' + user + '? All character data will be purged!</div>'
        + '<div id="frmPopupFooter" class="container-footer align-center">'
        + '</div>'
        );
        $('#frmPopupFooter').append('<button id="btnDecline" type="submit" name="back" value="back" class="button-icon-medium icon-decline submit-button margin-sides-5"></button>'
        + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '" class="button-icon-medium icon-accept submit-button margin-sides-5"></button>');
        $('.submit-button').click(function() {
          clicked = $(this).attr('id').split('btn')[1];
        });
      },
      edit: function(userName, email, confirmName, confirmValue) {
        $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.user.userInfo();"><div id="popupContainer" class="container-popup"></div></form>');
        $('#popupContainer').append('<div class="container-headline">Edit user details</div>'
        + '<div class="container-body">'
        + '<div class="col-40 is-inline margin-sides-5 align-top">'
        + '<div>Username</div>'
        + '<input id="frmUsername" type="text" name="username" class="input-themed col-90" placeholder="Username" value="' + userName + '" /><div id="frmUsernameError" class="text-error"></div>'
        + '</div>'
        + '<div class="col-40 is-inline margin-sides-5 align-top">'
        + '<div>Email</div>'
        + '<input id="frmEmail" type="text" name="email" class="input-themed col-90" placeholder="Email" value="' + email + '" /><div id="frmEmailError" class="text-error"></div>'
        + '</div>'
        + '</div>'
        + '<div id="frmPopupFooter" class="container-footer align-center">'
        + '</div>'
        );
        $('#frmPopupFooter').append('<button id="btnDecline" type="submit" name="back" value="back" class="button-icon-medium icon-decline submit-button margin-sides-5"></button>'
        + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '" class="button-icon-medium icon-accept submit-button margin-sides-5"></button>');
        $('.submit-button').click(function() {
          clicked = $(this).attr('id').split('btn')[1];
        });
      },
      update: function(user, email, rank, role, confirmName, confirmValue) {
        $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.user.userInfo();"><div id="popupContainer" class="container-popup"></div></form>');
        $('#popupContainer').append('<div class="container-headline">Edit user details</div>'
        + '<div class="container-body">'
        + '<div class="col-40 is-inline margin-sides-5 align-top">'
        + '<div>Username</div>'
        + '<input id="frmUsername" type="text" name="username" class="input-themed col-90" placeholder="Username" value="' + user + '" /><div id="frmUsernameError" class="text-error"></div>'
        + '</div>'
        + '<div class="col-40 is-inline margin-sides-5 align-top">'
        + '<div>Email</div>'
        + '<input id="frmEmail" type="text" name="email" class="input-themed col-90" placeholder="Email" value="' + email + '" /><div id="frmEmailError" class="text-error"></div>'
        + '</div>'
        + '<div class="col-40 is-inline margin-sides-5 align-top">'
        + '<div>Rank</div>'
        + '<div class="is-inline"><select id="frmRank" name="rank" class="select-themed input-full"></select></div><div id="frmRankError" class="text-error"></div>'
        + '</div>'
        + '<div class="col-40 is-inline margin-sides-5 align-top">'
        + '<div>Role</div>'
        + '<input id="frmRole" type="text" name="role" class="input-themed col-90" placeholder="Role" value="' + role + '" /><div id="frmRoleError" class="text-error"></div>'
        + '</div>'
        + '</div>'
        + '<div id="frmPopupFooter" class="container-footer align-center">'
        + '</div>'
        );
        $('#frmPopupFooter').append('<button id="btnDecline" type="submit" name="back" value="back" class="button-icon-medium icon-decline submit-button margin-sides-5"></button>'
        + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '" class="button-icon-medium icon-accept submit-button margin-sides-5"></button>');
        scarecrow.get.user.ranks(rank);
        $('.submit-button').click(function() {
          clicked = $(this).attr('id').split('btn')[1];
        });
      }
    }
  }
}
