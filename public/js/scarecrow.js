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
  _validateApplication: function() {
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
  _validateSignIn: function() {
    let userValid = true;
    let pwValid = true;
    let errormsg = '';
    $('.input-text-big').removeClass('invalid');
    $('.input-text-big').removeClass('valid');
    if ($('#username').val().length < 3) {
      $('#username').addClass('invalid');
      $('#usernameError').html('Username required');
      userValid = false;
    } else {
      $('#usernameError').html('');
    }
    if ($('#password').val() === '') {
      $('#password').addClass('invalid');
      $('#passwordError').html('Password required')
      pwValid = false;
    } else {
      $('#passwordError').html('');
    }
    if (!userValid || !pwValid) {
      return false
    } else {
      return true;
    }
  },
  _validateSignUp: function() {
    let userValid = true;
    let pwValid = true;
    let errormsg = '';
    $('.input-text-big').removeClass('invalid');
    $('.input-text-big').removeClass('valid');
    if ($('#username').val().length < 3) {
      $('#username').addClass('invalid');
      $('#usernameError').html('Username with at least 3 characters required');
      userValid = false;
    } else {
      $('#usernameError').html('')
    }
    if ($('#password').val() === '') {
      $('#password').addClass('invalid');
      $('#passwordError').html('Password required');
      pwValid = false;
    } else if ($('#password').val() !== $('#password_confirm').val()) {
      $('#password').addClass('invalid');
      $('#password_confirm').addClass('invalid');
      $('#passwordError').html('The passwords must match each other');
      $('#passwordConfirmError').html('The passwords must match each other');
      pwValid = false;
    } else {
      $('#passwordError').html('');
      $('#passwordConfirmError').html('');
    }
    if (!userValid || !pwValid) {
      return false
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
            $('#slctCharClass').html('<option class="select-options2" selected></option>');
            for (var i in classes) {
              $('#slctCharClass').append('<option class="select-options2">' + classes[i].name + '</option>')
            }
            $('#slctCharClass').change(function() {
              $('#slctCharRole').html('<option class="select-options2" selected></option>');
              for (var i in classes) {
                if (classes[i].name === $('#slctCharClass :selected').text()) {
                  classes[i].isDamage !== 0 ? $('#slctCharRole').append('<option class="select-options2">Damage</option>') : '';
                  classes[i].isSupport !== 0 ? $('#slctCharRole').append('<option class="select-options2">Support</option>') : '';
                  classes[i].isTank !== 0 ? $('#slctCharRole').append('<option class="select-options2">Tank</option>') : '';
                }
              }
            });
          }
        });
      }
    }
  },
  validate: {
    character: {
      add: function() {
        console.log('validate.character.add: ' + clicked);
        if (clicked === 'Confirm') {
          scarecrow.validate.highlight.character.add();
          if ($('#txtCharName').val() === '' || $('#slctCharClass option:selected').text() === '' || $('#slctCharRole option:selected').text() == '') {
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
        console.log('validate.character.delete: ' + clicked);
        if (clicked === 'Confirm') {
          return true
        } else if (clicked === 'Decline') {
          scarecrow.window.toggle.background();
          scarecrow.window.close.popup();
          return false;
        }
      }
    },
    highlight: {
      character: {
        add: function() {
          $('#txtCharName').val() === '' ? $('#txtCharName').addClass('invalid') : $('#txtCharName').removeClass('invalid');
          $('#txtCharName').val() === '' ? $('#txtCharNameError').html('Field required') : $('#txtCharNameError').html('');
          $('#slctCharClass option:selected').text() === '' ? $('#slctCharClass').addClass('invalid') : $('#slctCharClass').removeClass('invalid');
          $('#slctCharClass option:selected').text() === '' ? $('#slctCharClassError').html('Field required') : $('#slctCharClassError').html('');
          $('#slctCharRole option:selected').text() === '' ? $('#slctCharRole').addClass('invalid') : $('#slctCharRole').removeClass('invalid');
          $('#slctCharRole option:selected').text() === '' ? $('#slctCharRoleError').html('Field required') : $('#slctCharRoleError').html('');
        }
      }
    },
    user: {
      userInfo: function() {
        console.log(clicked);
        if (clicked === 'UpdateInfo') {
          scarecrow.window.toggle.background();
          scarecrow.window.user.edit($('#tblUsername').text(), $('#tblEmail').text(), 'edit', 'userInfo');
          return false;
        } else if (clicked === 'Confirm') {
          $('#txtUsername').val() === '' ? $('#txtUsername').addClass('invalid') : $('#txtUsername').removeClass('invalid');
          $('#txtUsername').val() === '' ? $('#txtUsernameError').html('Field required') : $('#txtUsernameError').html('');

          if ($('#txtUsername').val() === '') {
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
      character: function() {
        console.log(clicked);
        if (clicked === 'AddCharacter') {
          scarecrow.window.toggle.background();
          scarecrow.window.character.add('add', 'character');
        } else if (clicked.split('_')[0] === 'DeleteCharacter') {
          scarecrow.window.toggle.background();
          scarecrow.window.character.delete('delete', 'character', clicked.split('_')[1]);
        } else if (clicked.split('_')[0] === 'ChangeMainCharacter') {
          return true;
        }
        return false;
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
        $('.container-sc').append('<form class="popupForm" id="frmPopupWindow" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.character.add();">'
        + '<div class="container-frame">'
        + '<div class="container-headline">Add character</div>'
        + '<div class="container-body">'
        + '<table><tr><td>Character name</td><td>Class</td><td>Role</td></tr>'
        + '<tr><td valign="top"><div class="input-text-container"><input id="txtCharName" name="cName" type="input" class="input-text" /><div id="txtCharNameError" class="text-error"></div></div></td>'
        + '<td valign="top"><div class="input-text-container"><select id="slctCharClass" name="cClass" class="input-text"></select><div id="slctCharClassError" class="text-error"></div></div></td>'
        + '<td valign="top"><div class="input-text-container"><select id="slctCharRole" name="cRole" class="input-text"></select><div id="slctCharRoleError" class="text-error"></div></div></td></tr></table></div>'
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
        scarecrow.get.character.classes();
        $('.input-text').change(function() {
          scarecrow.validate.highlight.character.add();
        });
      },
      delete: function(confirmName, confirmValue, charID) {
        $('.container-sc').append('<form class="popupForm" id="frmPopupWindow" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.character.delete();">'
        + '<div class="container-frame">'
        + '<div class="container-headline">Delete character</div>'
        + '<div class="container-body">Are you sure you want to delete ' + $('#characterName_' + charID).text() + '? All character data will be purged!</div>'
        + '<div class="container-foot"><div class="buttonRow">'
        + '<button id="btnDecline" type="submit" name="back" value="back" class="response-button icon-decline"></button>'
        + '<button id="btnConfirm" type="submit" name="' + confirmName + '" value="' + confirmValue + '_' + charID + '" class="response-button icon-accept"></button>'
        + '</div></div>'
        + '</div>'
        + '</form>'
        );
        $('.response-button').click(function() {
          clicked = $(this).attr('id').split('btn')[1];
        });
      }
    },
    close: {
      popup: function() {
        $('#frmPopupWindow').remove();
      }
    },
    toggle: {
      background: function() {
        $('.pageMainComponent').toggleClass('inactive');
      }
    },
    user: {
      edit: function(userName, email, confirmName, confirmValue) {
        $('.container-sc').append('<form class="popupForm" id="frmPopupWindow" name="frmPopupWindow" method="post" onsubmit="return scarecrow.validate.user.userInfo();">'
        + '<div class="container-frame">'
        + '<div class="container-headline">Edit user details</div>'
        + '<div class="container-body">'
        +'<table><tr><td>Username</td><td>Email</td></tr>'
        +'<tr><td valign="top"><div class="input-text-container"><input id="txtUsername" name="username" type="input" class="input-text" value="' + userName + '" /><div id="txtUsernameError" class="text-error"></div></div></td>'
        +'<td valign="top"><div class="input-text-container"><input id="txtEmail" name="email" type="input" class="input-text" value="' + email + '" /><div id="txtEmailError" class="text-error"></div></div></td></tr></table>'
        + '</div>'
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
