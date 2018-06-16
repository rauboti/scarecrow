$(document).ready(function() {
  $('.signup-input').blur(function() {
    scarecrow._validateSignUp();
  });
  $('.signin-input').blur(function() {
    scarecrow._validateSignIn();
  });
  $('.menu-button-small').click(function() {
    if ($(this).attr('id').split('-')[1] === 'Progression') {
      $('.tblProgression').addClass('hidden');
      $(".boss-" + $(this).attr('id').split('-')[2]).removeClass('hidden');
    }
    $('.menu-button-small').removeClass('menu-button-selected');
    $(this).addClass('menu-button-selected');
  });
  $('.button').click(function() {
    if ($(this).attr('id').split('btn')[1] === 'AddCharacter') { scarecrow.addNewCharacter(); }
    else if ($(this).attr('id').split('btn')[1].split('_')[0] === 'DeleteCharacter') {
      const cID = $(this).attr('id').split('btn')[1].split('_')[1];
      var attr = {
        type: 'Delete character',
        question: 'Do you really want to delete ' + $('#character_' + cID).children('.charName').text() + '?',
        id: cID
      };
      scarecrow._boxConfirm(attr, function(cID) {
        scarecrow.deleteCharacter(cID, $('#character_' + cID).children('.charName').text(), $('#character_' + cID).children('.charClass').text(), $('#character_' + cID).children('.charRole').text());
        scarecrow._toggleFadeOut('#pageMainComponents');
      }, function() {
        scarecrow._toggleFadeOut('#pageMainComponents');
      });
    }
    else if ($(this).attr('id').split('btn')[1].split('_')[0] === 'UpdateInfo') { scarecrow.updateInfo($('#tblUsername').text(), $('#tblEmail').text()); }
  });
});
var scarecrow = {
  _apiLocationReload: function(data) {
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '../scarecrow/api',
      success: function(data) {
        location.reload();
      }
    });
  },
  _boxConfirm: function(attr, callbackConfirm, callbackDecline) {
    this._toggleFadeOut('#pageMainComponents');
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
  _toggleFadeOut: function(object) {
    $(object).toggleClass('inactive');
  },
  _validateSignIn: function() {
    let userValid = true;
    let pwValid = true;
    let errormsg = '';
    $('.input-text-big').removeClass('invalid');
    $('.input-text-big').removeClass('valid');
    if ($('#username').val().length < 3) {
      $('#username').addClass('invalid');
      errormsg += 'Username with at least 3 characters required<br>'
      userValid = false;
    }
    if ($('#password').val() === '') {
      $('#password').addClass('invalid');
      errormsg += 'Password required<br>';
      pwValid = false;
    }
    $('#errorMessage').html(errormsg);
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
      errormsg += 'Username with at least 3 characters required<br>'
      userValid = false;
    }
    if ($('#password').val() === '') {
      $('#password').addClass('invalid');
      errormsg += 'Password required<br>';
      pwValid = false;
    } else if ($('#password').val() !== $('#password_confirm').val()) {
      $('#password').addClass('invalid');
      $('#password_confirm').addClass('invalid');
      errormsg += 'The passwords must match each other<br>';
      pwValid = false;
    }
    $('#errorMessage').html(errormsg);
    if (!userValid || !pwValid) {
      return false
    } else {
      return true;
    }
  },
  addNewCharacter: function() {
    this._toggleFadeOut('#pageMainComponents');

    $('#pageContainer').append('<div id="boxCreateCharacter" class="popupBox"><div class="popupBoxContainer">'
    +'<div class="popupBoxTitle">Create new character</div>'
    +'<div class="popupBoxElement">'
    +'<div class="container-subgroup"><div class="container-element"><label for="txtCharName">Character name:</label></div><div class="container-element"><input id="txtCharName" type="input" class="input-text" required /></div></div>'
    +'<div class="container-subgroup"><div class="container-element"><label for="txtCharClass">Character class:</label></div><div class="container-element"><select id="slctCharClass" class="input-text" required><select></div></div>'
    +'<div class="container-subgroup"><div class="container-element"><label for="txtCharRole">Character role:</label></div><div class="container-element"><select id="slctCharRole" class="input-text" required><select></div></div>'
    +'</div><div id="errorMessage" class="text-error"></div>'
    +'</div><div class="buttonRow"><input id="btnSubmit" type="button" class="button input-button" value="Submit" /><input id="btnClose" type="button" class="button input-button" value="Cancel" /></div>'
    +'</div>');

    $('#btnClose').click(function() {
      scarecrow.closeWindow('#boxCreateCharacter');
    });
    $('#btnSubmit').click(function() {
      if ($('#txtCharName').val() !== '' && $('#slctCharClass :selected').text() !== '' && $('#slctCharRole :selected').text() !== '') {
        scarecrow.submitNewCharacter($('#txtCharName').val(), $('#slctCharClass :selected').text(), $('#slctCharRole :selected').text());
      } else {
        $('#errorMessage').html('All fields must be filled!')
      }
    });

    var data = { request: 'getCharacterClasses' };
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '../scarecrow/api',
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
  },
  closeWindow: function(win) {
    $(win).remove();
    this._toggleFadeOut('#pageMainComponents');
  },
  deleteCharacter: function (cID, cName, cClass) {
    var data = { request: 'characterDelete', cID: cID, cName: cName, cClass: cClass };
    this._apiLocationReload(data);
  },
  submitNewCharacter: function(cName, cClass, cRole) {
    var data = { request: 'characterSubmitNew', cName: cName, cClass: cClass, cRole: cRole };
    this._apiLocationReload(data);
  },
  submitUpdatedInfo: function(username, email) {
    var data = { request: 'userInformationUpdate', username: username, email: email };
    this._apiLocationReload(data);
  },
  updateInfo: function(username, email) {
    this._toggleFadeOut('#pageMainComponents');

    $('#pageContainer').append('<div id="boxUpdateInfo" class="popupBox"><div class="popupBoxContainer">'
    +'<div class="popupBoxTitle">Update user information</div>'
    +'<div class="popupBoxElement">'
    +'<div class="container-subgroup"><div class="container-element"><label for="txtUsername">Username:</label></div><div class="container-element"><input id="txtUsername" type="input" class="input-text" value="' + username + '" required /></div></div>'
    +'<div class="container-subgroup"><div class="container-element"><label for="txtEmail">Email:</label></div><div class="container-element"><input id="txtEmail" type="input" class="input-text" value="' + email + '" /></div></div>'
    +'</div><div id="errorMessage" class="text-error"></div>'
    +'</div><div class="buttonRow"><input id="btnSubmit" type="button" class="button input-button" value="Submit" /><input id="btnClose" type="button" class="button input-button" value="Cancel" /></div>'
    +'</div>');

    $('#btnClose').click(function() {
      scarecrow.closeWindow('#boxUpdateInfo');
    });
    $('#btnSubmit').click(function() {
      if ($('#txtUsername').val() !== '') {
        scarecrow.submitUpdatedInfo($('#txtUsername').val(), $('#txtEmail').val());
      } else {
        $('#errorMessage').html('Unable to remove username');
      }
    });
  }
}
