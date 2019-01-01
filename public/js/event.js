var clicked;
$(document).ready(function() {
  $('.action-button').click(function() {
    $(this).is('[id]') && (clicked = $(this).attr('id').split('btn')[1]);
  });
  $('.menuButtonRow-icon').click(function() {
    $('.menuButtonRow').slideToggle(500);
  });
});

function formValidation() {
  if (clicked === 'Accept') {
    return true;
  } else if (clicked === 'Back') {
    return true;
  } else if (clicked === 'Cancel') {
    scarecrow.window.close.popup();
    scarecrow.window.toggle.background();
    return false;
  } else if (clicked === 'Decline') {
    showPopup(clicked);
    return false;
  } else if (clicked === 'Maybe') {
    showPopup(clicked);
    return false;
  } else if (clicked === 'Submit') {
    formValidationMarkup();
    if ($('#frmComment').val() === '') {
      return false;
    } else {
      scarecrow.window.toggle.background();
      return true;
    }
  }
}

function formValidationMarkup() {
  if ($('#frmComment').val() === '') {
    $('#frmComment').addClass('invalidInput');
    $('#frmCommentError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
  } else {
    $('#frmComment').removeClass('invalidInput');
    $('#frmCommentError').css({'width': 'auto', 'display': 'block'}).html('');
  }
}

function showPopup(action) {
  scarecrow.window.toggle.background();
  let prompt = ''

  if (action === 'Decline') {
    prompt = 'Why are you unable to attend?'
  } else if (action === 'Maybe') {
    prompt = 'Why are you unsure?'
  }

  $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" onsubmit="return formValidation();" autocomplete="off"><div id="popupContainer" class="popupContainer">'
  + '<div class="popupContainer-headline">' + prompt + '</div>'
  + '<div class="formContainer-fullColumn"><input id="frmComment" type="text" name="comment" autocomplete="off" class="formInput"/><div id="frmCommentError" class="errorText"></div></div>'
  + '<div class="formContainer-buttonRow">'
  + '<button id="btnCancel" type="submit" name="back" value="back" class="action-button">Cancel</button>'
  + '<button id="btnSubmit" type="submit" name="sign" value="' + clicked.toLowerCase() + '" class="action-button">Submit</button>'
  + '</div>'
  + '</div></form>');

  $('.formInput').blur(function() {
    formValidationMarkup();
  });

  $('.action-button').click(function() {
    clicked = $(this).attr('id').split('btn')[1];
  });
}
