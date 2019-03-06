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
    $(this).attr('id').split('btn')[1] === 'ItemValues' && formItemValues();
    //$(this).attr('id').split('btn')[1] === 'LootValue' && ;
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
function formItemValues() {
  scarecrow.window.toggle.background();
  $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return false;" autocomplete="off"><div id="popupContainer" class="popupContainer">'
  + '<div class="popupContainer-headline">Edit item</div>'
  + '<div class="formContainer-halfColumn"><input id="txtItemSearch" type="text" name="item" placeholder="Search for item ID..." autocomplete="off" /></div>'
  + '<div class="formContainer-pentaColumn"><button id="btnFindItem" type="button" name="findItem" value="back">Find</button></div>'
  + '<div id="txtItemLink"></div>'
  + '<div class="formScrollfield" id="txtItemInfo"></div>'

  + '<div id="buttonRow" class="formContainer-buttonRow">'
  + '</div>'
  + '</div></form>');

  $('#btnFindItem').click(function() {
    scarecrow.get.item($('#txtItemSearch').val(), initItem);
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

function initItem(item) {
  const qualities = ['Poor', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  const slots = ['Head', 'Shoulder', 'Chest', 'Back', 'Wrist', 'Hands', 'Waist', 'Legs', 'Feet', 'Finger', 'Trinket', 'Relic', 'One-Hand', 'Two-Hand', 'Off Hand']

  scarecrow.get.coefficients(initCoefficients)

  $('#buttonRow').html('<button id="btnUpdate" type="submit" name="edit" value="item" class="popupContainer-button">Update</button>');
  $('#txtItemLink').html('<div><span>WH:</span><a href="https://classic.wowhead.com/item=' + $('#txtItemSearch').val() + '/" target="_blank"> https://classic.wowhead.com/item=' + $('#txtItemSearch').val() + '/</a></div>');

  item.name === '' ? $('#txtItemLink').append('<div><span>DB:</span>  Item not found in database</div>') : $('#txtItemLink').append('<div><span>DB:</span><a href="https://classic.wowhead.com/item=' + item.id + '/" target="_blank"><div class="clr-' + item.quality.toLowerCase() + '" style="display: inline-block">' + item.name + '</div></a></div>');

  $('#txtItemInfo').html('<div class="formHeadline">Item</div>'
  + '<div class="formContainer-halfColumn"><span>Item name</span>'
  + '<input id="frmName" type="text" name="name" class="itemInput" autocomplete="off" value="' + item.name + '"/></div>'
  + '<div class="formContainer-halfColumn"><span>Quality</span>'
  + '<select id="frmQuality" name="quality" class="itemInput"></select></div>'
  + '<div class="formContainer-halfColumn"><span>Item slot</span>'
  + '<select id="frmSlot" name="slot" class="itemInput"></select></div>'
  + '<div class="formContainer-halfColumn"><span>Instance</span>'
  + '<select id="frmInstance" name="instance" class="itemInput"></select></div>'

  + '<div class="formHeadline">Base stats</div>'
  + '<div class="formContainer-pentaColumn"><span>Agility</span>'
  + '<input id="frmagi" type="number" name="agi" class="itemInput value-tank value-physical" autocomplete="off" value="' + item.agi + '"/></div>'
  + '<div class="formContainer-pentaColumn"><span>Intellect</span>'
  + '<input id="frmint" type="number" name="int" class="itemInput value-magical value-healer" autocomplete="off" value="' + item.int + '"/></div>'
  + '<div class="formContainer-pentaColumn"><span>Spirit</span>'
  + '<input id="frmspi" type="number" name="spi" class="itemInput value-healer" autocomplete="off" value="' + item.spi + '"/></div>'
  + '<div class="formContainer-pentaColumn"><span>Stamina</span>'
  + '<input id="frmsta" type="number" name="sta" class="itemInput value-tank" autocomplete="off" value="' + item.sta + '"/></div>'
  + '<div class="formContainer-pentaColumn"><span>Strength</span>'
  + '<input id="frmstr" type="number" name="str" class="itemInput value-physical value-tank" autocomplete="off" value="' + item.str + '"/></div>'

  + '<div class="formHeadline">Defense</div>'
  + '<div class="formContainer-pentaColumn"><span>Defense</span>'
  + '<input id="frmdefense" type="number" name="defense" class="itemInput value-tank" autocomplete="off" value="' + item.defense + '"/></div>'
  + '<div class="formContainer-pentaColumn"><span>Parry</span>'
  + '<input id="frmparry" type="number" name="parry" class="itemInput value-tank" autocomplete="off" value="' + item.parry + '"/></div>'
  + '<div class="formContainer-pentaColumn"><span>Dodge</span>'
  + '<input id="frmdodge" type="number" name="dodge" class="itemInput value-tank" autocomplete="off" value="' + item.dodge + '"/></div>'
  + '<div class="formContainer-pentaColumn"><span>Block</span>'
  + '<input id="frmblock" type="number" name="block" class="itemInput value-tank" autocomplete="off" value="' + item.block + '"/></div>'

  + '<div class="formHeadline">Physic</div>'
  + '<div class="formContainer-pentaColumn"><span>DPS</span>'
  + '<input id="frmdps" type="number" name="dps" class="itemInput value-physical" autocomplete="off" value="' + item.dps + '"/></div>'
  + '<div class="formContainer-pentaColumn"><span>AP</span>'
  + '<input id="frmap" type="number" name="ap" class="itemInput value-physical" autocomplete="off" value="' + item.ap + '"/></div>'
  + '<div class="formContainer-pentaColumn"><span>Ranged AP</span>'
  + '<input id="frmrap" type="number" name="rap" class="itemInput value-physical" autocomplete="off" value="' + item.rap + '"/></div>'
  + '<div class="formContainer-pentaColumn"><span>Hit</span>'
  + '<input id="frmmelhit" type="number" name="melhit" class="itemInput value-physical" autocomplete="off" value="' + item.melhit + '"/></div>'
  + '<div class="formContainer-pentaColumn"><span>Crit</span>'
  + '<input id="frmmelcrit" type="number" name="melcrit" class="itemInput value-physical" autocomplete="off" value="' + item.melcrit + '"/></div>'

  + '<div class="formHeadline">Magic</div>'
  + '<div class="formContainer-pentaColumn"><span>MP5</span>'
  + '<input id="frmmp5" type="number" name="mp5" class="itemInput value-healer" autocomplete="off" value="' + item.mp5 + '"/></div>'
  + '<div class="formContainer-pentaColumn"><span>Damage</span>'
  + '<input id="frmsplpwr" type="number" name="splpwr" class="itemInput value-magical" autocomplete="off" value="' + item.splpwr + '"/></div>'
  + '<div class="formContainer-pentaColumn"><span>Healing</span>'
  + '<input id="frmhlrpwr" type="number" name="hlrpwr" class="itemInput value-healer" autocomplete="off" value="' + item.hlrpwr + '"/></div>'
  + '<div class="formContainer-pentaColumn"><span>Hit</span>'
  + '<input id="frmsplhit" type="number" name="splhit" class="itemInput value-magical" autocomplete="off" value="' + item.splhit + '"/></div>'
  + '<div class="formContainer-pentaColumn"><span>Crit</span>'
  + '<input id="frmsplcrit" type="number" name="splcrit" class="itemInput value-magical" autocomplete="off" value="' + item.splcrit + '"/></div>'

  + '<div class="formHeadline">Misc</div>'
  + '<div class="formContainer-pentaColumn"><span>Misc</span>'
  + '<input id="frmmisc" type="number" name="misc" class="itemInput value-tank value-physical value-magical value-tank" autocomplete="off" value="' + item.misc + '"/></div>'
  + '<div class="formContainer-pentaColumn"><span>Tanks</span>'
  + '<input id="frmvaluetank" type="number" name="tankvalue" class="itemInput" autocomplete="off" value="' + item.tankvalue + '" disabled /></div>'
  + '<div class="formContainer-pentaColumn"><span>Healers</span>'
  + '<input id="frmvalueheal" type="number" name="healvalue" class="itemInput" autocomplete="off" value="' + item.healvalue + '" disabled /></div>'
  + '<div class="formContainer-pentaColumn"><span>Physical DPS</span>'
  + '<input id="frmvaluephysical" type="number" name="dpsvalue" class="itemInput" autocomplete="off" value="' + item.physicalvalue + '" disabled /></div>'
  + '<div class="formContainer-pentaColumn"><span>Magical DPS</span>'
  + '<input id="frmvaluemagical" type="number" name="dpsvalue" class="itemInput" autocomplete="off" value="' + item.magicalvalue + '" disabled /></div>');

  scarecrow.get.instances(initInstances);

  for (var i in qualities) {
    if (qualities[i] === item.quality) {
      $('#frmQuality').append('<option selected>' + qualities[i] + '</option>');
    } else {
      $('#frmQuality').append('<option>' + qualities[i] + '</option>');
    }
  }
  for (var i in slots) {
    if (slots[i] === item.slot) {
      $('#frmSlot').append('<option selected>' + slots[i] + '</option>');
    } else {
      $('#frmSlot').append('<option>' + slots[i] + '</option>');
    }
  }
  $('#btnUpdate').click(function() {
    var item = {};
    $('.itemInput').each(function() {
      if ($(this).is('select')) {
        if ($(this).attr('id') === 'frmInstance') {
          item[$(this).attr('id').split('frm')[1].toLowerCase()] = parseInt($(this).find('option:selected').val());
        } else {
          item[$(this).attr('id').split('frm')[1].toLowerCase()] = $(this).find('option:selected').text();
        }
      } else if ($(this).is('input')) {
        if ($(this).attr('id') === 'frmName') {
          item[$(this).attr('id').split('frm')[1].toLowerCase()] = $(this).val();
        } else {
          item[$(this).attr('id').split('frm')[1].toLowerCase()] = parseFloat($(this).val());
        }
      }
    });
    item['id'] = parseInt($('#txtItemSearch').val())
    scarecrow.set.item(item)
  });

  function initCoefficients(coefficients) {
    calcPoints();
    console.log(coefficients)
    $('.itemInput').blur(function() {
      $(this).val() === '' && $(this).val(0);
      calcPoints();
    });
    function calcPoints() {
      var pTank = 0;
      var pHeal = 0;
      var pPhys = 0;
      var pMag = 0;
      for (var stat in coefficients) {
        if ($('#frm'+stat)) {
          if ($('#frm'+stat).hasClass('value-tank')) {
            pTank += parseFloat($('#frm'+stat).val())*coefficients[stat];
          }
          if ($('#frm'+stat).hasClass('value-healer')) {
            pHeal += parseFloat($('#frm'+stat).val())*coefficients[stat];
          }
          if ($('#frm'+stat).hasClass('value-physical')) {
            pPhys += parseFloat($('#frm'+stat).val())*coefficients[stat];
          }
          if ($('#frm'+stat).hasClass('value-magical')) {
            pMag += parseFloat($('#frm'+stat).val())*coefficients[stat];
          }
        }
      }
      $('#frmvaluetank').val(pTank);
      $('#frmvalueheal').val(pHeal);
      $('#frmvaluephysical').val(pPhys);
      $('#frmvaluemagical').val(pMag);
      //$('#txtPoints').html(points + ' points');
    }
  }

  function initInstances(instances) {
    for (var i in instances) {
      if (instances[i].id === item.instance) {
        $('#frmInstance').append('<option value="' + instances[i].id + '" selected>' + instances[i].name + '</option>');
      } else {
        $('#frmInstance').append('<option value="' + instances[i].id + '">' + instances[i].name + '</option>');
      }
    }
  }
}
function initUsers(users) {
  $('#userList').html('');
  for (var user in users) {
    users[user].role !== '' && users[user].role !== null ? users[user].role = '(' + users[user].role + ')' : users[user].role = '';
    $('#userList').append('<a href="/admin/user/' + users[user].id +'"><div class="userContainer"><div class="userContainer-user">' + users[user].name + '</div><div class="userContainer-guildPosition"><div class="userContainer-rank">' + users[user].rank + '</div><div class="userContainer-role">' + users[user].role + '</div></div></div></a>');
  }
}
