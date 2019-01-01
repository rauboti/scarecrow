var clicked;
$(document).ready(function() {
  $('.action-button').click(function() {
    $(this).is('[id]') && (clicked = $(this).attr('id').split('btn')[1]);
  });
  $('.menuButtonRow-icon').click(function() {
    $('.menuButtonRow').slideToggle(500);
  });
  $('.loginContainer-input').change(function() {
    formValidationMarkup();
  });
});

function formValidation() {
  formValidationMarkup();

  if ($('#username').val() !== '' && $('#password').val() !== '') {
    return true;
  } else {
    return false;
  }
}

function formValidationMarkup() {
  $('.invalidInput')
    .removeClass('invalidInput');
  $('.loginContainer-error')
    .css({'width': 'auto', 'display': 'block'})
    .html('')

  if ($('#username').val() === '') {
    $('#username')
      .addClass('invalidInput');
    $('#usernameError')
      .html('Username required')
      .css({'width': '85%', 'display': 'inline-block'});
  }

  if ($('#password').val() === '') {
    $('#password')
      .addClass('invalidInput');
    $('#passwordError')
      .html('Password required')
      .css({'width': '85%', 'display': 'inline-block'});
  }
}
