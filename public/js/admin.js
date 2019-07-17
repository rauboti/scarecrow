var clicked;
var popupClicked;
var searchTimer;
$(document).ready(function() {
  $('.action-button').click(function() {
    $(this).is('[id]') && (clicked = $(this).attr('id').split('btn')[1]);
    $(this).attr('id').split('btn')[1] === 'AddAttendance' && formAddAttendance();
    $(this).attr('id').split('btn')[1] === 'AddEvent' && formAddEvent();
    $(this).attr('id').split('btn')[1] === 'AwardItem' && formAwardItem();
    $(this).attr('id').split('btn')[1] === 'EditConsumes' && formEditConsumables();
    $(this).attr('id').split('btn')[1] === 'FindUsers' && $('#frmFindUsers').slideToggle(500);
  });
  $('.menuButtonRow-icon').click(function() {
    $('.menuButtonRow').slideToggle(500);
  });
  $('#frmFindUsers').hide();
  $('#txtUserSearch').keyup(function() {
    var qs = 0
    $('.querySetRadioButton').each(function() { $(this).is(':checked') && (qs = $(this).val()) });
    clearTimeout(searchTimer)
    var query = this.value;
    searchTimer = setTimeout(function() {
      if (query.length > 1 && qs !== 0) {
        scarecrow.get.users(query, qs, initUsers);
      }
    }, 300);
  });
});

function formAddAttendance() {
  scarecrow.window.toggle.background();
  $('body').append('<div id="frmPopup" class="popupContainer">'
  + '<div class="popupContainer-headline">Add attendance</div>'
  + '<div class="formContainer-halfColumn"><span>Raid</span>'
  + '<select id="frmRaid" name="raid"><option></option></select></div>'
  + '<div class="formContainer-halfColumn"><span>Boss</span>'
  + '<select id="frmBoss" name="boss"><option></option></select></div>'
  + '<div id="playerContainer" class="formContainer-fullColumn"></div>'
  + '<div class="formContainer-buttonRow">'
  + '<button id="btnCancel" type="submit" name="back" value="back" class="popupContainer-button">Cancel</button>'
  + '<button id="btnConfirm" type="submit" name="add" value="attendance" class="popupContainer-button">Submit</button>'
  + '</div>'
  + '</div>');

  scarecrow.get.event('all', initEvents);
  scarecrow.get.boss('all', initBosses);
  scarecrow.get.players(initPlayers);

  function initBosses(bosses) {
    for (var i in bosses) {
      $('#frmBoss').append('<option value="' + bosses[i].id + '">' + bosses[i].boss + '</option>')
    }
  }
  function initEvents(events) {
    for (var i in events) {
      var d = new Date(events[i].time)
      $('#frmRaid').append('<option value="' + events[i].id + '">' + events[i].name + ' [' + d.getDay() + '/' + (d.getMonth()+1) + ' - ' + d.getFullYear() + ']</option>')
    }
  }
  function initPlayers(players) {
    for (var i in players) {
      $('#playerContainer').append('<div class="formContainer-triColumn clr' + players[i].class + '"><input type="checkbox" class="chkPlayer" value="' + players[i].id + '"> ' + players[i].name + '</div>')
    }
  }

  $('#btnConfirm').click(function() {
    list = {}
    list['raid'] = $('#frmRaid option:selected').val();
    list['boss'] = $('#frmBoss option:selected').val();
    list['selected'] = []
    $('.chkPlayer').each(function() {
      $(this).is(':checked') && list['selected'].push($(this).val())
      $(this).prop('checked', false)
    });
    scarecrow.set.attendance(list);
  });
  $('#btnCancel').click(function() {
    scarecrow.window.close.popup();
    scarecrow.window.toggle.background();
  });
}
function formAddEvent() {
  scarecrow.window.toggle.background();
  $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return formAddEventValidate();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
  + '<div class="popupContainer-headline">Add new event</div>'
  + '<div class="formContainer-halfColumn"><span>Time</span>'
  + '<input id="frmDate" type="text" name="date" class="formInput" autocomplete="off" /><div id="frmDateError" class="errorText"></div></div>'
  + '<div class="formContainer-halfColumn"><span>Instance</span>'
  + '<select id="frmInstance" name="instance"></select></div>'
  + '<div class="formContainer-fullColumn"><span>Raid information</span>'
  + '<textarea id="frmInfo" name="info" class="formInput" autocomplete="off" /></textarea></div>'
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
function formAwardItem() {
  scarecrow.window.toggle.background();
  $('body').append('<div id="frmPopup" class="popupContainer">'
  + '<div class="popupContainer-headline">Award item</div>'
  + '<div class="formContainer-fullColumn"><select id="frmRaid" name="raid"><option value=""></option></select></div>'
  + '<div class="formContainer-halfColumn"><span>Player</span>'
  + '<select id="frmPlayer" name="player"><option value=""></option></select></div>'
  + '<div class="formContainer-halfColumn"><span>Specialization</span>'
  + '<select id="frmSpec" name="spec"><option value=""></option><option value="tank">Tank</option><option value="heal">Healer</option><option value="phys">Physical DPS</option><option value="mag">Magical DPS</option></select></div>'
  + '<div class="formContainer-fullColumn"><select id="frmItem" name="item"><option value=""></option></select></div>'
  + '<div class="formContainer-buttonRow">'
  + '<button id="btnCancel" type="submit" name="back" value="back" class="popupContainer-button">Cancel</button>'
  + '<button id="btnConfirm" type="submit" name="add" value="attendance" class="popupContainer-button">Submit</button>'
  + '</div>'
  + '</div>');

  scarecrow.get.event('all', initEvents);
  scarecrow.get.items('all', initItems);
  scarecrow.get.players(initPlayers);

  function initEvents(events) {
    for (var i in events) {
      var d = new Date(events[i].time)
      $('#frmRaid').append('<option value="' + events[i].id + '">' + events[i].name + ' [' + d.getDay() + '/' + (d.getMonth()+1) + ' - ' + d.getFullYear() + ']</option>')
    }
  }
  function initItems(items) {
    for (var i in items) {
      $('#frmItem').append('<option value="' + items[i].id + '">' + items[i].name + '</option>')
    }
  }
  function initPlayers(players) {
    for (var i in players) {
      $('#frmPlayer').append('<option value="' + players[i].id + '">' + players[i].name + '</option>');
    }
  }

  $('#btnConfirm').click(function() {
    if ($('#frmRaid option:selected').val() !== '' && $('#frmItem option:selected').val() !== '' && $('#frmPlayer option:selected').val() !== '') {
      scarecrow.set.itemRecipient($('#frmRaid option:selected').val(), parseInt($('#frmItem option:selected').val()), $('#frmPlayer option:selected').val(), $('#frmSpec option:selected').val())
    } else {
      console.log('Need more cowbell')
    }
  });
  $('#btnCancel').click(function() {
    scarecrow.window.close.popup();
    scarecrow.window.toggle.background();
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
    for (var i in consumables) {
      $('#slctInstance').append('<option value="' + i + '">' + consumables[i].instance + '</option>');
    }
    $('#slctInstance').change(function() {
      $('#txtList').text(consumables[$('#slctInstance :selected').val()].list);
    });
  }
  $('.popupContainer-button').click(function() {
    popupClicked = $(this).attr('id').split('btn')[1];
  });
}

function formAddAttendanceValidate() {
  console.log('Tried to submit it!')
  //return false;
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
    scarecrow.window.toggle.background();
    scarecrow.window.close.popup();
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
  $('#userList').html('');
  for (var user in users) {
    users[user].role !== '' && users[user].role !== null ? users[user].role = '(' + users[user].role + ')' : users[user].role = '';
    $('#userList').append('<a href="/admin/user/' + users[user].id +'"><div class="userContainer"><div class="userContainer-user">' + users[user].name + '</div><div class="userContainer-guildPosition"><div class="userContainer-rank">' + users[user].rank + '</div><div class="userContainer-role">' + users[user].role + '</div></div></div></a>');
  }
}
