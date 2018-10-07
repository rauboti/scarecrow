var scarecrow = {
  get: {
    character: {
      classes: function() {
        var data = { request: 'getCharacterClasses' };
        $.ajax({
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
          url: location.origin + '/api',
          success: function(classes) {
            $('#slctCharClass').html('<option class="option-ghostly" selected></option>');
            $('#frmCharClass').html('<option class="option-ghostly" selected></option>');
            for (var i in classes) {
              $('#slctCharClass').append('<option class="option-ghostly">' + classes[i].name + '</option>')
              $('#frmCharClass').append('<option class="option-ghostly">' + classes[i].name + '</option>')
            }
            $('#slctCharClass').change(function() {
              $('#slctCharRole').html('<option class="option-ghostly" selected></option>');
              for (var i in classes) {
                if (classes[i].name === $('#slctCharClass :selected').text()) {
                  classes[i].isDamage !== 0 ? $('#slctCharRole').append('<option class="option-ghostly">Damage</option>') : '';
                  classes[i].isSupport !== 0 ? $('#slctCharRole').append('<option class="option-ghostly">Support</option>') : '';
                  classes[i].isTank !== 0 ? $('#slctCharRole').append('<option class="option-ghostly">Tank</option>') : '';
                }
              }
            });
            $('#frmCharClass').change(function() {
              $('#frmCharRole').html('<option class="option-ghostly" selected></option>');
              for (var i in classes) {
                if (classes[i].name === $('#frmCharClass :selected').text()) {
                  classes[i].isDamage !== 0 ? $('#frmCharRole').append('<option class="option-ghostly">Damage</option>') : '';
                  classes[i].isSupport !== 0 ? $('#frmCharRole').append('<option class="option-ghostly">Support</option>') : '';
                  classes[i].isTank !== 0 ? $('#frmCharRole').append('<option class="option-ghostly">Tank</option>') : '';
                }
              }
            });
          }
        });
      }
    },
    user: {
      ranks: function(currentRank) {
        var data = { request: 'getUserRanks' };
        $.ajax({
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
          url: location.origin + '/api',
          success: function(ranks) {
            for (var i in ranks) {
              if (ranks[i].name === currentRank) {
                $('#frmRank').append('<option value="' + ranks[i].id + '" class="option-ghostly" selected>' + ranks[i].name + '</option>');
              } else {
                $('#frmRank').append('<option value="' + ranks[i].id + '" class="option-ghostly">' + ranks[i].name + '</option>');
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
      $('#txtCharName').val() === '' ? $('#txtCharName').addClass('invalid') : $('#txtCharName').removeClass('invalid');
      $('#txtCharName').val() === '' ? $('#txtCharNameError').html('Field required') : $('#txtCharNameError').html('');
      $('#slctCharClass option:selected').text() === '' ? $('#slctCharClass').addClass('invalid') : $('#slctCharClass').removeClass('invalid');
      $('#slctCharClass option:selected').text() === '' ? $('#slctCharClassError').html('Field required') : $('#slctCharClassError').html('');
      $('#slctCharRole option:selected').text() === '' ? $('#slctCharRole').addClass('invalid') : $('#slctCharRole').removeClass('invalid');
      $('#slctCharRole option:selected').text() === '' ? $('#slctCharRoleError').html('Field required') : $('#slctCharRoleError').html('');
      $('#txtLevel').val() === ''? $('#txtLevel').addClass('invalid') : $('#txtLevel').removeClass('invalid');
      $('#txtLevel').val() === '' ? $('#txtLevelError').html('Field required') : $('#txtLevelError').html('');
      $('#txtSpecLink').val() === '' ? $('#txtSpecLink').addClass('invalid') : $('#txtSpekLink').removeClass('invalid');
      $('#txtSpecLink').val() === '' ? $('#txtSpecLinkError').html('Field required') : $('#txtSpecLinkError').html('');
      $('#txtArmoryLink').val() === '' ? $('#txtArmoryLink').addClass('invalid') : $('#txtArmoryLink').removeClass('invalid');
      $('#txtArmoryLink').val() === '' ? $('#txtArmoryLinkError').html('Field required') : $('#txtArmoryLinkError').html('');
      $('#txtNumberOfRaids').val() === '' ? $('#txtNumberOfRaids').addClass('invalid') : $('#txtNumberOfRaids').removeClass('invalid');
      $('#txtNumberOfRaids').val() === '' ? $('#txtNumberOfRaidsError').html('Field required') : $('#txtNumberOfRaidsError').html('');
      $('#txtPreparation').val() === '' ? $('#txtPreparation').addClass('invalid') : $('#txtPreparation').removeClass('invalid');
      $('#txtPreparation').val() === '' ? $('#txtPreparationError').html('Field required') : $('#txtPreparationError').html('');
      $('#txtValuableAsset').val() === '' ? $('#txtValuableAsset').addClass('invalid') : $('#txtValuableAsset').removeClass('invalid');
      $('#txtValuableAsset').val() === '' ? $('#txtValuableAssetError').html('Field required') : $('#txtValuableAssetError').html('');
      $('#txtMakingMistake').val() === '' ? $('#txtMakingMistake').addClass('invalid') : $('#txtMakingMistake').removeClass('invalid');
      $('#txtMakingMistake').val() === '' ? $('#txtMakingMistakeError').html('Field required') : $('#txtMakingMistakeError').html('');
      $('#txtAnythingElse').val() === '' ? $('#txtAnythingElse').addClass('invalid') : $('#txtAnythingElse').removeClass('invalid');
      $('#txtAnythingElse').val() === '' ? $('#txtAnythingElseError').html('Field required') : $('#txtAnythingElseError').html('');

      if ($('#txtCharName').val() === '' || $('#slctCharClass option:selected').text() === '' || $('#slctCharRole option:selected').text() === '' || $('#txtLevel').val() === '' || $('#txtSpecLink').val() === '' || $('#txtArmoryLink').val() === '' || $('#txtNumberOfRaids').val() === '' || $('#txtPreparation').val() === '' || $('#txtValuableAsset').val() === '' || $('#txtMakingMistake').val() === '' || $('#txtAnythingElse').val() === '') {
        return false;
      } else {
        return true;
      }
    },
    character: {
      add: function() {
        if (clicked === 'ShowWindow') {
          scarecrow.window.toggle.background();
          scarecrow.window.character.add('add', 'character');
        } else if (clicked === 'Confirm') {
          scarecrow.validate.highlight.character.add();
          if ($('#frmCharName').val() === '' || $('#frmCharClass option:selected').text() === '' || $('#frmCharRole option:selected').text() == '') {
            return false;
          } else {
            return true;
          }
        } else if (clicked === 'Decline') {
          scarecrow.window.toggle.background();
          scarecrow.window.close.popup();
          return false;
        } else if (clicked.split('_')[0] === 'ChangeMainCharacter') {
          return true;
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
    highlight: {
      access: {

      },
      character: {
        add: function() {
          $('#frmCharName').val() === '' ? $('#frmCharName').addClass('invalid') : $('#frmCharName').removeClass('invalid');
          $('#frmCharName').val() === '' ? $('#frmCharNameError').html('Field required') : $('#frmCharNameError').html('');
          $('#frmCharClass option:selected').text() === '' ? $('#frmCharClass').addClass('invalid') : $('#frmCharClass').removeClass('invalid');
          $('#frmCharClass option:selected').text() === '' ? $('#frmCharClassError').html('Field required') : $('#frmCharClassError').html('');
          $('#frmCharRole option:selected').text() === '' ? $('#frmCharRole').addClass('invalid') : $('#frmCharRole').removeClass('invalid');
          $('#frmCharRole option:selected').text() === '' ? $('#frmCharRoleError').html('Field required') : $('#frmCharRoleError').html('');
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
        if (isMobile.any()) {
          $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.character.add();"><div id="popupContainer" class="container-popup-mobile"></div></form>');
        } else {
          $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.character.add();"><div id="popupContainer" class="container-popup-desktop"></div></form>');
        }
        $('#popupContainer').append('<div class="container-headline">Add new character</div>'
        + '<div class="container-body">'
        + '<div>'
        + '<div class="col-90 is-inline margin-sides-5 align-top">'
        + '<div>Character name</div>'
        + '<div class="col-60 is-inline"><input id="frmCharName" type="text" name="cName" class="input-ghostly input-popup input-full" /></div><div id="frmCharNameError" class="text-error is-inline col-30 margin-sides-5"></div>'
        + '</div>'
        + '</div>'
        + '<div class="col-90 is-inline margin-sides-5 align-top">'
        + '<div>Class</div>'
        + '<div class="col-60 is-inline"><select id="frmCharClass" name="cClass" class="select-ghostly input-popup input-full"></select></div><div id="frmCharClassError" class="text-error is-inline col-30 margin-sides-5"></div>'
        + '</div>'
        + '<div class="col-90 is-inline margin-sides-5 align-top">'
        + '<div>Role</div>'
        + '<div class="col-60 is-inline"><select id="frmCharRole" name="cRole" class="select-ghostly input-popup input-full"></select></div><div id="frmCharRoleError" class="text-error is-inline col-30 margin-sides-5"></div>'
        + '</div>'
        + '</div>'
        + '<div id="frmPopupFooter" class="container-footer align-center">'
        + '</div>'
        );
        if (isMobile.any()) {
          $('#frmPopupFooter').append('<button id="btnDecline" type="submit" name="back" value="back" class="button-icon-medium-mobile icon-decline submit-button margin-sides-5"></button>'
            + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '" class="button-icon-medium-mobile icon-accept submit-button margin-sides-5"></button>');
        } else {
          $('#frmPopupFooter').append('<button id="btnDecline" type="submit" name="back" value="back" class="button-icon-medium-desktop icon-decline submit-button margin-sides-5"></button>'
            + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '" class="button-icon-medium-desktop icon-accept submit-button margin-sides-5"></button>');
        }
        $('.submit-button').click(function() {
          clicked = $(this).attr('id').split('btn')[1];
        });
        scarecrow.get.character.classes();
        $('.input-popup').change(function() {
          scarecrow.validate.highlight.character.add();
        });
      },
      delete: function(confirmName, confirmValue, charID) {
        if (isMobile.any()) {
          $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.character.delete();"><div id="popupContainer" class="container-popup-mobile"></div></form>');
        } else {
          $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.character.delete();"><div id="popupContainer" class="container-popup-desktop"></div></form>');
        }
        $('#popupContainer').append('<div class="container-headline">Delete character</div>'
        + '<div class="container-body">Are you sure you want to delete ' + $('#characterName_' + charID).html() + '? All character data will be purged!</div>'
        + '<div id="frmPopupFooter" class="container-footer align-center">'
        + '</div>'
        );
        if (isMobile.any()) {
          $('#frmPopupFooter').append('<button id="btnDecline" type="submit" name="back" value="back" class="button-icon-medium-mobile icon-decline submit-button margin-sides-5"></button>'
            + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '_' + charID + '" class="button-icon-medium-mobile icon-accept submit-button margin-sides-5"></button>');
        } else {
          $('#frmPopupFooter').append('<button id="btnDecline" type="submit" name="back" value="back" class="button-icon-medium-desktop icon-decline submit-button margin-sides-5"></button>'
            + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '_' + charID + '" class="button-icon-medium-desktop icon-accept submit-button margin-sides-5"></button>');
        }
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
    toggle: {
      background: function() {
        $('menu').toggleClass('inactive');
        $('.container-page').toggleClass('inactive');
      }
    },
    user: {
      delete: function(user, confirmName, confirmValue) {
        if (isMobile.any()) {
          $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.user.userInfo();"><div id="popupContainer" class="container-popup-mobile"></div></form>');
        } else {
          $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.user.userInfo();"><div id="popupContainer" class="container-popup-desktop"></div></form>');
        }
        $('#popupContainer').append('<div class="container-headline">Delete character</div>'
        + '<div class="container-body">Are you sure you want to delete ' + user + '? All character data will be purged!</div>'
        + '<div id="frmPopupFooter" class="container-footer align-center">'
        + '</div>'
        );
        if (isMobile.any()) {
          $('#frmPopupFooter').append('<button id="btnDecline" type="submit" name="back" value="back" class="button-icon-medium-mobile icon-decline submit-button margin-sides-5"></button>'
            + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '" class="button-icon-medium-mobile icon-accept submit-button margin-sides-5"></button>');
        } else {
          $('#frmPopupFooter').append('<button id="btnDecline" type="submit" name="back" value="back" class="button-icon-medium-desktop icon-decline submit-button margin-sides-5"></button>'
            + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '" class="button-icon-medium-desktop icon-accept submit-button margin-sides-5"></button>');
        }
        $('.submit-button').click(function() {
          clicked = $(this).attr('id').split('btn')[1];
        });
      },
      edit: function(userName, email, confirmName, confirmValue) {
        if (isMobile.any()) {
          $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.user.userInfo();"><div id="popupContainer" class="container-popup-mobile"></div></form>');
        } else {
          $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.user.userInfo();"><div id="popupContainer" class="container-popup-desktop"></div></form>');
        }
        $('#popupContainer').append('<div class="container-headline">Edit user details</div>'
        + '<div class="container-body">'
        + '<div class="col-40 is-inline margin-sides-5 align-top">'
        + '<div>Username</div>'
        + '<input id="frmUsername" type="text" name="username" class="input-ghostly col-90 input-popup" placeholder="Username" value="' + userName + '" /><div id="frmUsernameError" class="text-error"></div>'
        + '</div>'
        + '<div class="col-40 is-inline margin-sides-5 align-top">'
        + '<div>Email</div>'
        + '<input id="frmEmail" type="text" name="email" class="input-ghostly col-90 input-popup" placeholder="Email" value="' + email + '" /><div id="frmEmailError" class="text-error"></div>'
        + '</div>'
        + '</div>'
        + '<div id="frmPopupFooter" class="container-footer align-center">'
        + '</div>'
        );
        if (isMobile.any()) {
          $('#frmPopupFooter').append('<button id="btnDecline" type="submit" name="back" value="back" class="button-icon-medium-mobile icon-decline submit-button margin-sides-5"></button>'
            + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '" class="button-icon-medium-mobile icon-accept submit-button margin-sides-5"></button>');
        } else {
          $('#frmPopupFooter').append('<button id="btnDecline" type="submit" name="back" value="back" class="button-icon-medium-desktop icon-decline submit-button margin-sides-5"></button>'
            + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '" class="button-icon-medium-desktop icon-accept submit-button margin-sides-5"></button>');
        }
        $('.submit-button').click(function() {
          clicked = $(this).attr('id').split('btn')[1];
        });
      },
      update: function(user, email, rank, role, confirmName, confirmValue) {
        if (isMobile.any()) {
          $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.user.userInfo();"><div id="popupContainer" class="container-popup-mobile"></div></form>');
        } else {
          $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.user.userInfo();"><div id="popupContainer" class="container-popup-desktop"></div></form>');
        }
        $('#popupContainer').append('<div class="container-headline">Edit user details</div>'
        + '<div class="container-body">'
        + '<div class="col-40 is-inline margin-sides-5 align-top">'
        + '<div>Username</div>'
        + '<input id="frmUsername" type="text" name="username" class="input-ghostly col-90 input-popup" placeholder="Username" value="' + user + '" /><div id="frmUsernameError" class="text-error"></div>'
        + '</div>'
        + '<div class="col-40 is-inline margin-sides-5 align-top">'
        + '<div>Email</div>'
        + '<input id="frmEmail" type="text" name="email" class="input-ghostly col-90 input-popup" placeholder="Email" value="' + email + '" /><div id="frmEmailError" class="text-error"></div>'
        + '</div>'
        + '<div class="col-40 is-inline margin-sides-5 align-top">'
        + '<div>Rank</div>'
        + '<div class="is-inline"><select id="frmRank" name="rank" class="select-ghostly input-popup input-full"></select></div><div id="frmRankError" class="text-error"></div>'
        + '</div>'
        + '<div class="col-40 is-inline margin-sides-5 align-top">'
        + '<div>Role</div>'
        + '<input id="frmRole" type="text" name="role" class="input-ghostly col-90 input-popup" placeholder="Role" value="' + role + '" /><div id="frmRoleError" class="text-error"></div>'
        + '</div>'
        + '</div>'
        + '<div id="frmPopupFooter" class="container-footer align-center">'
        + '</div>'
        );
        if (isMobile.any()) {
          $('#frmPopupFooter').append('<button id="btnDecline" type="submit" name="back" value="back" class="button-icon-medium-mobile icon-decline submit-button margin-sides-5"></button>'
            + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '" class="button-icon-medium-mobile icon-accept submit-button margin-sides-5"></button>');
        } else {
          $('#frmPopupFooter').append('<button id="btnDecline" type="submit" name="back" value="back" class="button-icon-medium-desktop icon-decline submit-button margin-sides-5"></button>'
            + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '" class="button-icon-medium-desktop icon-accept submit-button margin-sides-5"></button>');
        }
        scarecrow.get.user.ranks(rank);
        $('.submit-button').click(function() {
          clicked = $(this).attr('id').split('btn')[1];
        });
      }
    }
  }
}
