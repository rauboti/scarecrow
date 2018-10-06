var scarecrow = {
  _apiLocationReload: function(data) {
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '../api',
      success: function(data) {
        location.reload();
      }
    });
  },
  _boxConfirm: function(attr, callbackConfirm, callbackDecline) {
    this._toggleFadeOut('.pageMainComponents');
    $('#pageContainer').append('<div id="boxConfirm" class="popupBox"><div class="popupBoxContainer"><div class="popupBoxTitle">' + attr.type + '</div><div class="popupBoxElement">' + attr.question + '</div><div class="buttonRow"><button id="resAccept" class="input-button">Yes</button><button id="resDecline" class="input-button">No</button></div></div></div>');
    $('#resAccept').click(function () {
      $('#boxConfirm').remove();
      callbackConfirm(attr.id);
    });
    $('#resDecline').click(function () {
      $('#boxConfirm').remove();
      callbackDecline();
    });
  },
  _confirm: function(frmId, validationFunction, title, text, confirmName, confirmValue) {
    $('.container-sc').append('<form class="popupForm" id="' + frmId + '" name="' + frmId + '" method="post" onsubmit="return scarecrow.' + validationFunction + '();">'
    + '<div class="container-frame">'
    + '<div class="container-headline">' + title + '</div>'
    + '<div class="container-body">' + text + '</div>'
    + '<div class="container-foot"><div class="buttonRow">'
    + '<button id="btnDecline" type="submit" name="back" value="back" class="response-button icon-decline"></button>'
    + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '" class="response-button icon-accept"></button>'
    + '</div></div>'
    + '</div>'
    + '</form>'
    );
    $('.response-button').click(function() {
      clicked = $(this).attr('id').split('btn')[1];
    });
  },
  _toggleFadeOut: function(object) {
    $(object).toggleClass('inactive');
  },
  _validateCharacterForm: function() {
    $('#txtCharName').val() === '' ? $('#txtCharName').addClass('invalid') : $('#txtCharName').removeClass('invalid');
    $('#txtCharName').val() === '' ? $('#txtCharNameError').html('Field required') : $('#txtCharNameError').html('');
    $('#slctCharClass option:selected').text() === '' ? $('#slctCharClass').addClass('invalid') : $('#slctCharClass').removeClass('invalid');
    $('#slctCharClass option:selected').text() === '' ? $('#slctCharClassError').html('Field required') : $('#slctCharClassError').html('');
    $('#slctCharRole option:selected').text() === '' ? $('#slctCharRole').addClass('invalid') : $('#slctCharRole').removeClass('invalid');
    $('#slctCharRole option:selected').text() === '' ? $('#slctCharRoleError').html('Field required') : $('#slctCharRoleError').html('');
  },
  _validateNewChar: function() {
    $('#txtCharName').val() === '' ? $('#txtCharName').addClass('invalid') : $('#txtCharName').removeClass('invalid');
    $('#txtCharName').val() === '' ? $('#txtCharNameError').html('Field required') : $('#txtCharNameError').html('');
    $('#slctCharClass option:selected').text() === '' ? $('#slctCharClass').addClass('invalid') : $('#slctCharClass').removeClass('invalid');
    $('#slctCharClass option:selected').text() === '' ? $('#slctCharClassError').html('Field required') : $('#slctCharClassError').html('');
    $('#slctCharRole option:selected').text() === '' ? $('#slctCharRole').addClass('invalid') : $('#slctCharRole').removeClass('invalid');
    $('#slctCharRole option:selected').text() === '' ? $('#slctCharRoleError').html('Field required') : $('#slctCharRoleError').html('');

    if ($('#txtCharName').val() === '' || $('#slctCharClass option:selected').text() === '' || $('#slctCharRole option:selected').text() == '') {
      return false;
    } else {
      return true;
    }
  },
  addCharacter: function(frmId, validationFunction, confirmName, confirmValue) {
    $('.container-sc').append('<form class="popupForm" id="' + frmId + '" name="' + frmId + '" method="post" onsubmit="return scarecrow.' + validationFunction + '();">'
    + '<div class="container-frame">'
    + '<div class="container-headline">Add character</div>'
    + '<div class="container-body">'
    + '<table><tr><td>Character name</td><td>Class</td><td>Role</td></tr>'
    + '<tr><td valign="top"><div class="input-text-container"><input id="txtCharName" name="cName" type="input" class="input-text" /><div id="txtCharNameError" class="text-error"></div></div></td>'
    + '<td valign="top"><div class="input-text-container"><select id="slctCharClass" name="cClass" class="input-text"></select><div id="slctCharClassError" class="text-error"></div></div></td>'
    + '<td valign="top"><div class="input-text-container"><select id="slctCharRole" name="cRole" class="input-text"></select><div id="slctCharRoleError" class="text-error"></div></div></td></tr></table></div>'
    + '<div class="container-foot"><div class="buttonRow">'
    + '<button id="btnDecline" type="submit" name="back" value="back" class="response-button icon-decline"></button>'
    + '<button id="btnConfirmNewCharacter" type="submit" name="' + confirmName + '" value="' + confirmValue + '" class="response-button icon-accept"></button>'
    + '</div></div>'
    + '</div>'
    + '</form>'
    );
    $('.response-button').click(function() {
      clicked = $(this).attr('id').split('btn')[1];
    });
    scarecrow.get.character.classes();
    //scarecrow.getCharacterClasses('../../../api');
    $('.input-text').change(function() {
      scarecrow._validateCharacterForm();
    });
  },
  closeWindow: function(win) {
    $(win).remove();
    this._toggleFadeOut('.pageMainComponent');
  },
  deleteCharacter: function (frmId, validationFunction, confirmName, confirmValue, charID) {
    $('.container-sc').append('<form class="popupForm" id="' + frmId + '" name="' + frmId + '" method="post" onsubmit="return scarecrow.' + validationFunction + '();">'
    + '<div class="container-frame">'
    + '<div class="container-headline">Delete character</div>'
    + '<div class="container-body">Are you sure you want to delete ' + $('#characterName_' + charID).text() + '? All character data will be purged!</div>'
    + '<div class="container-foot"><div class="buttonRow">'
    + '<button id="btnDecline" type="submit" name="back" value="back" class="response-button icon-decline"></button>'
    + '<button id="btnConfirmDelete" type="submit" name="' + confirmName + '" value="' + confirmValue + '_' + charID + '" class="response-button icon-accept"></button>'
    + '</div></div>'
    + '</div>'
    + '</form>'
    );
    $('.response-button').click(function() {
      clicked = $(this).attr('id').split('btn')[1];
    });
  },
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
      userInfo: function() {
        if (clicked === 'UpdateInfo') {
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
      },
      delete: function() {
        console.log(clicked);
        if (clicked === 'Back') {
          return true;
        } else if (clicked === 'Confirm') {
          return true;
        } else if (clicked === 'Decline') {
          scarecrow.window.toggle.background();
          scarecrow.window.close.popup();
          return false;
        } else if (clicked === 'Delete') {
          scarecrow.window.toggle.background();
          scarecrow.window.user.delete('username', 'delete', 'user');
          return false;
        }
        return false;

        /*




        */


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
      delete: function(user, confirmName, confirmValue) {
        $('.container-sc').append('<form class="popupForm" id="frmPopupWindow" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.user.delete();">'
        + '<div class="container-frame">'
        + '<div class="container-headline">Delete user</div>'
        + '<div class="container-body">Are you sure you want to delete ' + user + '? All user data, including user characters, will be purged!</div>'
        + '<div class="container-foot"><div class="buttonRow">'
        + '<button id="btnDecline" type="submit" name="back" value="back" class="response-button icon-decline"></button>'
        + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '" class="response-button icon-accept"></button>'
        + '</div></div>'
        + '</div>'
        + '</form>'
        );
        $('.response-button').click(function() {
          clicked = $(this).attr('id').split('btn')[1];
        });
      }
    }
  }
}
