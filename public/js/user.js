var frmClicked;
var qmClicked;
$(document).ready(function() {
  $('.rolloutContainer').hide();
  $('.action-button').click(function() {
    $(this).is('[id]') && (qmClicked = $(this).attr('id').split('btn')[1]);
  });
  $('.menuButtonRow-icon').click(function() {
    $('.menuButtonRow').slideToggle(500);
  });
  $('.rolloutController').click(function() {
    var rollout = $(this).attr('id').split('Show')[1].toLowerCase();
    if ($('#' + rollout + 'Container').hasClass('expanded')) {
      $('#' + rollout + 'Container').removeClass('expanded').slideToggle(500);
    } else {
      $('#' + rollout + 'Container').addClass('expanded').slideToggle(500);
    }
  });
  $('.formController').click(function() {
    $(this).attr('id').split('btn')[1] === 'EditUser' && formEditUser($('#txtUsername').text(), $('#txtEmail').text(), $('#txtRank').text(), $('#txtRole').text());
    $(this).attr('id').split('btn')[1] === 'AddChar' && formAddChar();
    $(this).attr('id').split('btn')[1] === 'DelUser' && formDelUser();
  });
  $('.charContainer-button').click(function() {
    action = $(this).attr('id').split('_')[0];
    character = $(this).val();
    if (action === 'delete') {
      formDelChar(character);
    } else if (action === 'edit') {
      formEditChar(character);
    }
  });
});

function formAddChar() {
  scarecrow.window.toggle.background();
  $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return formValidateChar();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
  + '<div class="popupContainer-headline">Add new character</div>'
  + '<div class="formContainer-halfColumn"><span>Name</span>'
  + '<input id="frmCName" type="text" name="cName" class="formInput" autocomplete="off"/><div id="frmCNameError" class="errorText"></div></div>'
  + '<div class="formContainer-halfColumn"><span>Level</span>'
  + '<input id="frmCLevel" type="number" name="cLevel" class="formInput" autocomplete="off"/><div id="frmCLevelError" class="errorText"></div></div>'
  + '<div class="formContainer-halfColumn"><span>Class</span>'
  + '<select id="frmCClass" name="cClass"></select></div>'
  + '<div class="formContainer-halfColumn"><span>Role</span>'
  + '<select id="frmCRole" name="cRole"></select></div>'
  + '<div class="formContainer-buttonRow">'
  + '<button id="btnDecline" type="submit" name="back" value="back" class="formPopup-button">Cancel</button>'
  + '<button id="btnConfirm" type="submit" name="add" value="character" class="formPopup-button">Submit</button>'
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
  $('.formInput').blur(function() {
    formValidateCharMarkup($(this).attr('id'));
  });
  $('.formPopup-button').click(function() {
    frmClicked = $(this).attr('id').split('btn')[1];
  });
}
function formDelChar(charID) {
  scarecrow.window.toggle.background();
  $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return formValidateDelete();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
  + '<div class="popupContainer-headline">Delete character</div>'
  + '<div class="formContainer-fullColumn">Are you sure you want to delete <font color="red">' + $('#txtCName_' + charID).html() + '</font>? All character data will be purged!</div>'
  + '<div class="formContainer-buttonRow">'
  + '<button id="btnDecline" type="submit" name="back" value="back" class="formPopup-button">Cancel</button>'
  + '<button id="btnConfirm" type="submit" name="delChar" value="' + charID + '" class="formPopup-button">Confirm</button>'
  + '</div>'
  + '</div></form>');

  $('.formPopup-button').click(function() {
    frmClicked = $(this).attr('id').split('btn')[1];
  });
}
function formDelUser() {
  scarecrow.window.toggle.background();
  $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return formValidateDelete();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
  + '<div class="popupContainer-headline">Delete user</div>'
  + '<div class="formContainer-fullColumn">Are you sure you want to delete <font color="red">' + $('#txtUsername').text() + '</font>? All user and character data will be purged!</div>'
  + '<div class="formContainer-buttonRow">'
  + '<button id="btnDecline" type="submit" name="back" value="back" class="formPopup-button">Cancel</button>'
  + '<button id="btnConfirm" type="submit" name="delete" value="user" class="formPopup-button">Confirm</button>'
  + '</div>'
  + '</div></form>');

  $('.formPopup-button').click(function() {
    frmClicked = $(this).attr('id').split('btn')[1];
  });
}

function formEditChar(charID) {
  scarecrow.window.toggle.background();
  $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return formValidateChar();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
  + '<div class="popupContainer-headline">Edit character</div>'
  + '<div class="formContainer-halfColumn"><span>Name</span>'
  + '<input id="frmCName" type="text" name="cName" class="formInput" value="' + $('#txtCName_' + charID).html() + '" autocomplete="off"/><div id="frmCNameError" class="errorText"></div></div>'
  + '<div class="formContainer-halfColumn"><span>Level</span>'
  + '<input id="frmCLevel" type="number" name="cLevel" class="formInput" value="' + $('#txtCLevel_' + charID).html() + '" autocomplete="off"/><div id="frmCLevelError" class="errorText"></div></div>'

  + '<div class="formContainer-halfColumn"><span>Main</span>'
  + '<select id="frmMain" name="cMain"></select></div>'

  + '<div class="formContainer-buttonRow">'
  + '<button id="btnDecline" type="submit" name="back" value="back" class="formPopup-button">Cancel</button>'
  + '<button id="btnConfirm" type="submit" name="editChar" value="' + charID + '" class="formPopup-button">Submit</button>'
  + '</div>'
  + '</div></form>');

  if ($('#edit_' + charID).attr('main') == 1) {
    $('#frmMain').append('<option value="1" selected>Main</option><option value="0">Alt</option>')
  } else {
    $('#frmMain').append('<option value="1">Main</option><option value="0" selected>Alt</option>')
  }

  $('.formPopup-button').click(function() {
    frmClicked = $(this).attr('id').split('btn')[1];
  });
  $('.formInput').blur(function() {
    formValidateCharMarkup();
  });
}
function formEditUser(username, email, rank, role) {
  scarecrow.window.toggle.background();

  $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return formValidateUser();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
  + '<div class="popupContainer-headline">Edit information</div>'
  + '<div class="formContainer-halfColumn"><span>Username</span>'
  + '<input id="frmUsername" type="text" name="username" class="formInput" value="' + username + '" autocomplete="off"/><div id="frmUsernameError" class="errorText"></div></div>'
  + '<div class="formContainer-halfColumn"><span>Email</span>'
  + '<input id="frmEmail" type="text" name="email" class="formInput" value="' + email + '" autocomplete="off"/></div>'
  + '<div class="formContainer-halfColumn"><span>Rank</span>'
  + '<select id="frmRank" name="rank" class="formInput"></select></div>'
  + '<div class="formContainer-halfColumn"><span>Role</span>'
  + '<input id="frmRole" type="text" name="role" class="formInput" value="' + role + '" autocomplete="off"/></div>'
  + '<div class="formContainer-buttonRow">'
  + '<button id="btnDecline" type="submit" name="back" value="back" class="formPopup-button">Cancel</button>'
  + '<button id="btnConfirm" type="submit" name="editUser" value="general" class="formPopup-button">Submit</button>'
  + '</div>'
  + '</div></form>');

  $('.formPopup-button').click(function() {
    frmClicked = $(this).attr('id').split('btn')[1];
  });
  $('.formInput').blur(function() {
    formValidateUserMarkup($(this).attr('id'));
  });

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
}

function formValidateChar() {
  if (frmClicked === 'Confirm') {
    formValidateCharMarkup('all')
    if ($('#frmCName').val().length > 1 && $('#frmCLevel').val() > 0 && $('#frmCLevel').val() < 61) {
      return true;
    } else {
      return false;
    }
  } else if (frmClicked === 'Decline') {
    scarecrow.window.toggle.background();
    scarecrow.window.close.popup();
    return false;
  }
}
function formValidateDelete() {
  if (frmClicked === 'Confirm') {
    return true;
  } else if (frmClicked === 'Decline') {
    scarecrow.window.toggle.background();
    scarecrow.window.close.popup();
    return false;
  }
}
function formValidateUser() {
  if (frmClicked === 'Confirm') {
    formValidateUserMarkup();
    $('#frmUsername').val() === '' ? frmComplete = false : frmComplete = true;
    return frmComplete;
  } else if (frmClicked === 'Decline') {
    scarecrow.window.toggle.background();
    scarecrow.window.close.popup();
    return false;
  }
}

function formValidateCharMarkup(field) {
  if (field === 'frmCName' || field === 'all') {
    if ($('#frmCName').val() === '') {
      $('#frmCName').addClass('invalidInput');
      $('#frmCNameError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
    } else if ($('#frmCName').val().length < 2) {
      $('#frmCName').addClass('invalidInput');
      $('#frmCNameError').css({'width': '85%', 'display': 'inline-block'}).html('Minimum 2 characters');
    } else {
      $('#frmCName').removeClass('invalidInput');
      $('#frmCNameError').css({'width': 'auto', 'display': 'block'}).html('');
    }
  }
  if (field === 'frmCLevel' || field === 'all') {
    if ($('#frmCLevel').val() < 1) {
      $('#frmCLevel').addClass('invalidInput');
      $('#frmCLevelError').css({'width': '85%', 'display': 'inline-block'}).html('Minimum level 1');
    } else if ($('#frmCLevel').val() > 60) {
      $('#frmCLevel').addClass('invalidInput');
      $('#frmCLevelError').css({'width': '85%', 'display': 'inline-block'}).html('Maximum level 60');
    } else {
      $('#frmCLevel').removeClass('invalidInput');
      $('#frmCLevelError').css({'width': 'auto', 'display': 'block'}).html('');
    }
  }
}
function formValidateUserMarkup() {
  if ($('#frmUsername').val() === '') {
    $('#frmUsername').addClass('invalidInput');
    $('#frmUsernameError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
  } else {
    $('#frmUsername').removeClass('invalidInput');
    $('#frmUsernameError').css({'width': 'auto', 'display': 'block'}).html('');
  }
}

function validateQuickmenu() {
  if (qmClicked === 'Back') {
    return true;
  }
  return false;
}
