var clicked;
$(document).ready(function() {
  $('.action-button').click(function() {
    $(this).is('[id]') && (clicked = $(this).attr('id').split('btn')[1]);
  });
  $('.menuButtonRow-icon').click(function() {
    $('.menuButtonRow').slideToggle(500);
  });
  $('.loginContainer-input').blur(function() {
    formValidationMarkup($(this).attr('id'));
  });
});

function formValidation() {

  if ($('#username').val() !== '' && $('#password').val() !== '') {
    return true;
  } else {
    formValidationMarkup('all');
    return false;
  }
}

function formValidationMarkup(field) {

  if (field === 'username' || field === 'all') {
    if ($('#username').val() === '') {
      $('#username').addClass('invalidInput');
      $('#usernameError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
    } else {
      $('#username').removeClass('invalidInput');
      $('#usernameError').css({'width': 'auto', 'display': 'block'}).html('');
    }
  }

  if (field === 'password' || field === 'all') {
    if ($('#password').val() === '') {
      $('#password').addClass('invalidInput');
      $('#passwordError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
    } else {
      $('#password').removeClass('invalidInput');
      $('#passwordError').css({'width': 'auto', 'display': 'block'}).html('');
    }
  }
}
