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
    $(this).attr('id').split('btn')[1] === 'AddItem' && formAddItem();
    $(this).attr('id').split('btn')[1] === 'ImportCharacters' && formGetCharacters();
  });

  $('.charContainer').click(function() {
    formEditChar($(this).children('.charContainer-details').children('.charContainer-id').val(), $(this).children('.charContainer-details').children('.charContainer-nickname').text(), $(this).children('.charContainer-details').children('.charContainer-server').val());
  });
});

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

// => Character forms
function formGetCharacters() {
  scarecrow.window.toggle.background();
  // Displaying an empty popupform with a message
  $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return formValidateGetChar();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
  + '<div class="popupContainer-headline">Add new character</div>'
  + '<div id="loadingMsg"><br><br><i>Fetching character data from Battle.net...</i><br><br><br></div>'
  + '</div></form>');
  
  // Pulling character data
  scarecrow.get.characters(initCharacters);

  function initCharacters(characters) {
    // Removing the loading-message and instead adding elements to the form
    $('#loadingMsg').remove();
    $('#popupContainer').append('<div class="formContainer-fullColumn">'
    + '<select id="frmServer" name="server"><option value=""></option></select></div>'
    + '<div id="frmCharacters" class="formContainer-fullColumn charList"></div>'
    + '<input type="hidden" id="frmName" name="name" value=""/>'
    + '<input type="hidden" id="frmLevel" name="level" value=""/>'
    + '<input type="hidden" id="frmClass" name="class" value=""/>'
    + '<input type="hidden" id="frmSpec" name="spec" value=""/>'
    + '<input type="hidden" id="frmRole" name="role" value=""/>'
    + '<span id="frmError" class="errorText"></span>'
    + '<div class="formContainer-buttonRow">'
    + '<button id="btnBack" type="submit" name="back" value="back" class="action-button">Cancel</button>'
    + '<button id="btnAdd" type="submit" name="add" value="character" class="action-button">Add</button>'
    + '</div>')

    $('.action-button').click(function() {
      clicked = $(this).attr('id').split('btn')[1];
    });

    scarecrow.get.classes(initClasses);

    function initClasses(classes) {
      for (var server in characters) {
        $('#frmServer').append('<option value="' + server.toLowerCase() + '">' + server + '</option>')
      }

      $('#frmServer').change(function() {
        $('#frmName').val('');
        $('#frmLevel').val('');
        $('#frmClass').val('');
        $('#frmSpec').val('');
        $('#frmRole').val('');
        $('#frmError').html('');
        $('#frmCharacters').html('');
        for (var char in characters[$('#frmServer option:selected').text()]) {
          if (classes[characters[$('#frmServer option:selected').text()][char].class]) {
            characters[$('#frmServer option:selected').text()][char].spec ? spec = characters[$('#frmServer option:selected').text()][char].spec.name : spec = '';
            characters[$('#frmServer option:selected').text()][char].spec ? role = characters[$('#frmServer option:selected').text()][char].spec.role : role = '';
            var percentage = (characters[$('#frmServer option:selected').text()][char].level/60*100)
            $('#frmCharacters').append('<div class="charContainer"><div class="charContainer-details"><input type="hidden" class="charContainer-role" value="' + role + '"/><div class="charContainer-nickname clr' + classes[characters[$('#frmServer option:selected').text()][char].class] + '">' + char + '</div><div class="charContainer-spec">' + spec + '</div> <div class="charContainer-class">' + classes[characters[$('#frmServer option:selected').text()][char].class] + '</div></div>'
            + '<div class="charContainer-graph"><svg viewBox="0 0 36 36" class="graphCircle">'
            + '<path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>'
            + '<path class="circle" stroke-dasharray="' + percentage + ', 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />'
            + '<text x="18" y="20.35" class="graphCircle-text charContainer-level">' + characters[$('#frmServer option:selected').text()][char].level + '</text></svg></div>'
            + '</div>')
          }
        }
        $('.charContainer').click(function() {
          $('.charContainer').removeClass('selected');
          $(this).addClass('selected');
          $('#frmName').val($(this).children('.charContainer-details').children('.charContainer-nickname').text());
          $('#frmLevel').val(parseInt($(this).children('.charContainer-graph').children('.graphCircle').children('.charContainer-level').text()));
          $('#frmClass').val($(this).children('.charContainer-details').children('.charContainer-class').text());
          $('#frmSpec').val($(this).children('.charContainer-details').children('.charContainer-spec').text());
          $('#frmRole').val($(this).children('.charContainer-details').children('.charContainer-role').val());
        })
      });
    }   
  }
}
function formEditChar(id, name, server) {
  scarecrow.window.toggle.background();
  // Displaying an empty popupform with a message
  $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" autocomplete="off"><div id="popupContainer" class="popupContainer">'
  + '<div class="popupContainer-headline">' + name + ' options</div>'
  + '<input type="hidden" name="character" value="' + id + '"/>'
  + '<input type="hidden" name="name" value="' + name + '"/>'
  + '<input type="hidden" name="server" value="' + server + '"/>'
  + '<div class="formContainer-buttonRow">'
  + '<button id="btnUpdate" type="submit" name="update" value="character">Update character</button>'
  + '<button id="btnDelete" type="button">Delete character</button>'
  + '<button id="btnClose" type="button">Close</button>'
  + '</div>'
  + '</div></form>');

  $('#btnClose').click(function() { scarecrow.window.toggle.background(); scarecrow.window.close.popup(); });

  $('#btnDelete').click(function() {
    $('#popupContainer').append('<div id="boxConfirmDelete"><span>Are you certain you want to delete ' + name + '?</span><div class="formContainer-buttonRow">'
    + '<button id="btnConfirm" type="submit" name="delete" value="character">Yes</button>'
    + '<button id="btnDecline" type="button">No</button>'
    + '</div></div>');

    $('#btnDecline').click(function() { scarecrow.window.close.other('#boxConfirmDelete') });
  });
}

// => Character validation
function formValidateGetChar() {
  if (clicked === 'Add') {
    if ($('#frmName').val() !== '') {
      if (parseInt($('#frmLevel').val()) <= 60) {
        return true;
      } else {
        $('#frmError').html('Character too high level, please select a character level 60 or lower.')
        return false;
      }
    } else {
      $('#frmError').html('No character selected, please select a character to import.')
      return false;
    }
  } else {
    scarecrow.window.toggle.background();
    scarecrow.window.close.popup();
    return false;
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
function formValidateUserMarkup() {
  if ($('#frmUsername').val() === '') {
    $('#frmUsername').addClass('invalidInput');
    $('#frmUsernameError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
  } else {
    $('#frmUsername').removeClass('invalidInput');
    $('#frmUsernameError').css({'width': 'auto', 'display': 'block'}).html('');
  }
}