var clicked;
$(document).ready(function() {
  $('.action-button').click(function() {
    $(this).is('[id]') && (clicked = $(this).attr('id').split('btn')[1]);
  });
  $('.menuButtonRow-icon').click(function() {
    $('.menuButtonRow').slideToggle(500);
  });
  $('.apply-input').blur(function() {
    formValidationMarkup($(this).attr('id'));
  });
  $('#btnSelectChar').click(function() {
    formSelectChar();
  });
});

//  ------------------------------------------------------------ { Character selection }
function formSelectChar() {
  scarecrow.window.toggle.background();
  // Displaying an empty popupform with a message
  $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return formValidateGetChar();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
  + '<div class="popupContainer-headline">Select character</div>'
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
    + '<button id="btnCancel" type="button">Cancel</button>'
    + '<button id="btnSelect" type="button">Select</button>'
    + '</div>')

    $('#btnCancel').click(function() {
      scarecrow.window.close.popup();
      scarecrow.window.toggle.background();
    });

    $('#btnSelect').click(function() {
      if ($('#frmName').val() !== '') {
        if (parseInt($('#frmLevel').val()) <= 60) {
          $('#frmCharacter').html('<div class="charContainer"><div class="charContainer-details">'
          + '<input type="hidden" class="charContainer-role" name="role" value="' + $('#frmRole').val() + '"/>'
          + '<input type="hidden" class="charContainer-class" name="class" value="' + $('#frmClass').val() + '"/>'
          + '<input type="hidden" class="charContainer-name" name="name" value="' + $('#frmName').val() + '"/>'
          + '<input type="hidden" class="charContainer-spec" name="spec" value="' + $('#frmSpec').val() + '"/>'
          + '<input type="hidden" class="charContainer-level" name="level" value="' + $('#frmLevel').val() + '"/>'
          + '<div class="charContainer-nickname clr' + $('#frmClass').val() + '">' + $('#frmName').val() + '</div><div class="charContainer-spec">' + $('#frmSpec').val() + '</div> <div class="charContainer-class">' + $('#frmClass').val() + '</div> - <div class="charContainer-server">' + $('#frmServer option:selected').text().toUpperCase() + '</div></div>'
          + '<div class="charContainer-graph"><svg viewBox="0 0 36 36" class="graphCircle">'
          + '<path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>'
          + '<path class="circle" stroke-dasharray="' + (parseInt($('#frmLevel').val())/60*100).toString() + ', 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />'
          + '<text x="18" y="20.35" class="graphCircle-text charContainer-level">' + $('#frmLevel').val() + '</text></svg></div>'
          + '</div>');
          scarecrow.window.close.popup();
          scarecrow.window.toggle.background();
          $('#btnSelectChar').hide();
          $('.charContainer').click(function() {
            formSelectChar();
          });
        } else {
          $('#frmError').html('Character too high level, please select a character level 60 or lower.')
        }
      } else {
        $('#frmError').html('No character selected, please select a character to import.')
      }
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

//  ------------------------------------------------------------ { Validation }
function formValidation() {
    if ($('#frmCharacter').html() !== '' && $('#frmNumberOfRaids').val() !== '' && $('#frmPreparation').val() !== '' && $('#frmWhy').val() !== '') {
      return true;
    } else {
      formValidationMarkup('all')
      return false;
    }
}

//  ------------------------------------------------------------ { Visuals }
function formValidationMarkup(field) {
  if (field == 'frmCharacter' || field === 'all') {
    if ($('#frmCharacter').html() === '') {
      $('#frmCharacterError').css({'width': '85%', 'display': 'inline-block'}).html('Please select the character you want to apply with');
    } else {
      $('#frmCharacterError').css({'width': 'auto', 'display': 'block'}).html('');
    }
  }

  if (field === 'frmNumberOfRaids' || field === 'all') {
    if ($('#frmNumberOfRaids').val() === '') {
      $('#frmNumberOfRaids').addClass('invalidInput');
      $('#frmNumberOfRaidsError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
    } else {
      $('#frmNumberOfRaids').removeClass('invalidInput');
      $('#frmNumberOfRaidsError').css({'width': 'auto', 'display': 'block'}).html('');
    }
  }

  if (field === 'frmPreparation' || field === 'all') {
    if ($('#frmPreparation').val() === '') {
      $('#frmPreparation').addClass('invalidInput');
      $('#frmPreparationError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
    } else {
      $('#frmPreparation').removeClass('invalidInput');
      $('#frmPreparationError').css({'width': 'auto', 'display': 'block'}).html('');
    }
  }

  if (field === 'frmWhy' || field === 'all') {
    if ($('#frmWhy').val() === '') {
      $('#frmWhy').addClass('invalidInput');
      $('#frmWhyError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
    } else {
      $('#frmWhy').removeClass('invalidInput');
      $('#frmWhyError').css({'width': 'auto', 'display': 'block'}).html('');
    }
  }
}
