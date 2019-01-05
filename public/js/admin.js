var clicked;
var popupClicked;
var searchTimer;
$(document).ready(function() {
  $('.action-button').click(function() {
    $(this).is('[id]') && (clicked = $(this).attr('id').split('btn')[1]);
    $(this).attr('id').split('btn')[1] === 'AddEvent' && formAddEvent();
    $(this).attr('id').split('btn')[1] === 'EditConsumes' && formEditConsumables();
    $(this).attr('id').split('btn')[1] === 'FindUsers' && $('#frmFindUsers').slideToggle(500);
  });
  $('.menuButtonRow-icon').click(function() {
    $('.menuButtonRow').slideToggle(500);
  });
  $('#frmFindUsers').hide();
  $('#txtUserSearch').keyup(function() {
    clearTimeout(searchTimer)
    var query = this.value;
    searchTimer = setTimeout(function() {
      if (query.length > 2) {
        scarecrow.get.users(query, initUsers);
      }
    }, 300);
  });
});

function formAddEvent() {
  scarecrow.window.toggle.background();
  $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return formAddEventValidate();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
  + '<div class="popupContainer-headline">Add new event</div>'
  + '<div class="formContainer-halfColumn"><span>Time</span>'
  + '<input id="frmDate" type="text" name="date" class="formInput" autocomplete="off" /><div id="frmDateError" class="errorText"></div></div>'
  + '<div class="formContainer-halfColumn"><span>Instance</span>'
  + '<select id="frmInstance" name="instance"></select></div>'
  + '<div class="formContainer-buttonRow">'
  + '<button id="btnDecline" type="submit" name="back" value="back" class="popupContainer-button">Cancel</button>'
  + '<button id="btnConfirm" type="submit" name="add" value="event" class="popupContainer-button">Submit</button>'
  + '</div>'
  + '</div></form>');

  scarecrow.get.instances(initInstances);
  function initInstances(instances) {
    for (var i in instances) {
      $('#frmInstance').append('<option value="' + instances[i].id + '">' + instances[i].name + '</option>')
    }
  }
  $('.popupContainer-button').click(function() {
    clicked = $(this).attr('id').split('btn')[1];
  });
  $('#frmDate').datepicker({timepicker:'true', language:'en', dateFormat:'D M dd yyyy'});
  $('.formInput').blur(function() {
    formAddEventValidateMarkup();
  });
}
function formEditConsumables() {
  scarecrow.window.toggle.background();
  $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return formValidateEditConsumables();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
  + '<div class="popupContainer-headline">Edit required consumables</div>'
  + '<div class="formContainer-fullColumn"><select id="slctInstance" name="instance"><option value=""></option></select></div>'
  + '<div class="formContainer-fullColumn"><textarea id="txtList" name="list"></textarea></div>'
  + '<div class="formContainer-buttonRow">'
  + '<button id="btnDecline" type="submit" name="back" value="back" class="popupContainer-button">Cancel</button>'
  + '<button id="btnConfirm" type="submit" name="edit" value="consumables" class="popupContainer-button">Save</button>'
  + '</div>'
  + '</div></form>');
  scarecrow.get.consumables(initConsumables);
  function initConsumables(consumables) {
    console.log(consumables)
    for (var i in consumables) {
      $('#slctInstance').append('<option value="' + i + '">' + consumables[i].instance + '</option>');
    }
    $('#slctInstance').change(function() {
      console.log($('#slctInstance :selected').val());
      $('#txtList').text(consumables[$('#slctInstance :selected').val()].list);
    });
  }
  $('.popupContainer-button').click(function() {
    popupClicked = $(this).attr('id').split('btn')[1];
  });
}

function formAddEventValidate() {
  if (clicked === 'Confirm') {
    formAddEventValidateMarkup();
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
function formValidateEditConsumables() {
  if (popupClicked === 'Confirm') {
    return true;
  } else if (popupClicked === 'Decline') {
    return false;
  }
}

function formAddEventValidateMarkup() {
  if ($('#frmDate').val() === '') {
    $('#frmDate').addClass('invalidInput');
    $('#frmDateError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
  } else {
    $('#frmDate').removeClass('invalidInput');
    $('#frmDateError').css({'width': 'auto', 'display': 'block'}).html('');
  }
}

function initUsers(users) {
  console.log(users)
  $('#userList').html('');
  for (var user in users) {
    users[user].role !== '' && users[user].role !== null ? users[user].role = '(' + users[user].role + ')' : users[user].role = '';
    $('#userList').append('<a href="/admin/user/' + users[user].id +'"><div class="userContainer"><div class="userContainer-user">' + users[user].name + '</div><div class="userContainer-guildPosition"><div class="userContainer-rank">' + users[user].rank + '</div><div class="userContainer-role">' + users[user].role + '</div></div></div></a>');
  }
}
