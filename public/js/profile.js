var clicked;
$(document).ready(function() {
  $('.rolloutContainer').hide();
  $('.action-button').click(function() {
    $(this).is('[id]') && (clicked = $(this).attr('id').split('btn')[1]);
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
    $(this).attr('id').split('btn')[1] === 'EditUser' && formEditUser($('#txtUsername').text(), $('#txtEmail').text(), $('#txtTheme').text());
    $(this).attr('id').split('btn')[1] === 'AddChar' && formAddChar();
    $(this).attr('id').split('btn')[1] === 'AddItem' && formAddItem();
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
  + '<button id="btnDecline" type="submit" name="back" value="back" class="action-button">Cancel</button>'
  + '<button id="btnConfirm" type="submit" name="add" value="character" class="action-button">Submit</button>'
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
  $('.action-button').click(function() {
    clicked = $(this).attr('id').split('btn')[1];
  });
}
function formAddItem() {
  scarecrow.window.toggle.background();
  $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return formValidateAddItem();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
  + '<div class="popupContainer-headline">Add to wishlist</div>'
  + '<div class="formContainer-fullColumn"><input id="txtItemSearch" type="text" name="item" placeholder="Type to search.." autocomplete="off" /></div>'
  + '<div class="formContainer-fullColumn"><div id="itemList" style="text-align: center;" class="itemList"></div></div>'
  + '<div class="formContainer-buttonRow">'
  + '<button id="btnDecline" type="submit" name="back" value="back" class="action-button">Cancel</button>'
  + '</div>'
  + '</div></form>');

  $('.action-button').click(function() {
    clicked = $(this).attr('id').split('btn')[1];
  });
  //gets available instances and sends the callback to a callback-function
  scarecrow.get.instances(initInstances)
  var searchTimer;
  $('#txtItemSearch').keyup(function() {
    clearTimeout(searchTimer)
    var query = this.value;
    searchTimer = setTimeout(function() {
      if (query.length > 4) {
        scarecrow.get.items(query, initItems);
      }
    }, 300);
  });
  var instances;
  //Handles the callback from the instances query
  function initInstances(response) { instances = response; }
  //Handles the callback from the items query
  function initItems(response) {
    console.log(response)
    $('#itemList').html('');
    for (var slot in response) {
      for (var item in response[slot]) {
        $('#itemList').append('<a href="https://classic.wowhead.com/item=' + response[slot][item].id + '/" target="_blank"><div class="itemContainer clr-'+ response[slot][item].quality +'"><strong>'+response[slot][item].name+'</strong></div></a><button id="btnAdd_' + response[slot][item].id + '" type="submit" name="wlAdd" value="' + response[slot][item].id + '" class="itemContainer-button iconButton icon-add"></button>')
      }
    }
    $('.itemContainer-button').click(function() {
      clicked = $(this).attr('id').split('btn')[1];
    });
  }
}
function formDelChar(charID) {
  scarecrow.window.toggle.background();
  $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return formValidateDelChar();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
  + '<div class="popupContainer-headline">Delete character</div>'
  + '<div class="formContainer-fullColumn">Are you sure you want to delete <font color="red">' + $('#txtCName_' + charID).html() + '</font>? All character data will be purged!</div>'
  + '<div class="formContainer-buttonRow">'
  + '<button id="btnDecline" type="submit" name="back" value="back" class="action-button">Cancel</button>'
  + '<button id="btnConfirm" type="submit" name="delChar" value="' + charID + '" class="action-button">Confirm</button>'
  + '</div>'
  + '</div></form>');

  $('.action-button').click(function() {
    clicked = $(this).attr('id').split('btn')[1];
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
  + '<div class="formContainer-buttonRow">'
  + '<button id="btnDecline" type="submit" name="back" value="back" class="action-button">Cancel</button>'
  + '<button id="btnConfirm" type="submit" name="editChar" value="' + charID + '" class="action-button">Submit</button>'
  + '</div>'
  + '</div></form>');

  $('.action-button').click(function() {
    clicked = $(this).attr('id').split('btn')[1];
  });
  $('.formInput').blur(function() {
    formValidateCharMarkup();
  });
}
function formEditUser(username, email, theme) {
  scarecrow.window.toggle.background();
  $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return formValidateUser();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
  + '<div class="popupContainer-headline">Edit information</div>'
  + '<div class="formContainer-halfColumn"><span>Username</span>'
  + '<input id="frmUsername" type="text" name="username" class="formInput" value="' + username + '" autocomplete="off"/><div id="frmUsernameError" class="errorText"></div></div>'
  + '<div class="formContainer-halfColumn"><span>Email</span>'
  + '<input id="frmEmail" type="text" name="email" class="formInput" value="' + email + '" autocomplete="off"/></div>'
  + '<div class="formContainer-halfColumn"><span>Theme</span>'
  + '<select id="frmTheme" name="theme" class="formInput"></select></div>'
  + '<div class="formContainer-buttonRow">'
  + '<button id="btnDecline" type="submit" name="back" value="back" class="action-button">Cancel</button>'
  + '<button id="btnConfirm" type="submit" name="editUser" value="general" class="action-button">Submit</button>'
  + '</div>'
  + '</div></form>');

  $('.action-button').click(function() {
    clicked = $(this).attr('id').split('btn')[1];
  });
  $('.formInput').blur(function() {
    formValidateUserMarkup($(this).attr('id'));
  });

  scarecrow.get.themes(initThemes);
  function initThemes(themes) {
    for (var i in themes) {
      if (themes[i].name.toLowerCase() === theme.toLowerCase()) {
        $('#frmTheme').append('<option value="' + themes[i].name.toLowerCase() + '" selected>' + themes[i].name + '</option>')
      } else {
        $('#frmTheme').append('<option value="' + themes[i].name.toLowerCase() + '">' + themes[i].name + '</option>')
      }
    }
  }
}

function formValidateAddItem() {
  if (clicked.split('_')[0] === 'Add') {
    return true;
  } else if (clicked === 'Decline') {
    scarecrow.window.toggle.background();
    scarecrow.window.close.popup();
  }
  return false;
}
function formValidateDelChar() {
  if (clicked === 'Confirm') {
    return true;
  } else if (clicked === 'Decline') {
    scarecrow.window.toggle.background();
    scarecrow.window.close.popup();
    return false;
  }
}
function formValidateChar() {
  if (clicked === 'Confirm') {
    formValidateCharMarkup('all')
    if ($('#frmCName').val().length > 1 && $('#frmCLevel').val() > 0 && $('#frmCLevel').val() < 61) {
      return true;
    } else {
      return false;
    }
  } else if (clicked === 'Decline') {
    scarecrow.window.toggle.background();
    scarecrow.window.close.popup();
    return false;
  }
}
function formValidateUser() {
  if (clicked === 'Confirm') {
    formValidateUserMarkup();
    $('#frmUsername').val() === '' ? frmComplete = false : frmComplete = true;
    return frmComplete;
  } else if (clicked === 'Decline') {
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
