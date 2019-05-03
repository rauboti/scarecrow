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
    $(this).attr('id').split('btn')[1] === 'DelUser' && formDelUser();
  });
});

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

function formEditUser(username, email, rank, role) {
  scarecrow.window.toggle.background();

  $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return formValidateUser();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
  + '<div class="popupContainer-headline">Edit information</div>'
  + '<div class="formContainer-halfColumn"><span>Username</span>'
  + '<input id="frmUsername" type="text" name="username" class="formInput" value="' + username + '" autocomplete="off" disabled/><div id="frmUsernameError" class="errorText"></div></div>'
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
