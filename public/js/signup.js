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
  if ($('#username').val().length > 2 && $('#password').val() !== '' && $('#confirmPassword').val() !== '' && $('#password').val() === $('#confirmPassword').val()) {
    return true;
  } else {
    formValidationMarkup('all')
    return false;
  }
}

function formValidationMarkup(field) {

  if (field === 'username' || field === 'all') {
    if ($('#username').val() === '') {
      $('#username').addClass('invalidInput');
      $('#usernameError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
    } else if ($('#username').val() !== '' && $('#username').val().length < 3) {
      $('#username').addClass('invalidInput');
      $('#usernameError').css({'width': '85%', 'display': 'inline-block'}).html('Must be at least 3 characters');
    } else {
      $('#username').removeClass('invalidInput');
      $('#usernameError').css({'width': 'auto', 'display': 'block'}).html('');
    }
  }

  if (field === 'password' || field === 'confirmPassword' || field === 'all') {
    if ($('#password').val() === $('#confirmPassword').val()) {
      if ($('#password').val() === '' && $('#confirmPassword').val() === '') {
        $('#password').addClass('invalidInput');
        $('#passwordError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
        $('#confirmPassword').addClass('invalidInput');
        $('#confirmPasswordError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
      } else {
        $('#password').removeClass('invalidInput');
        $('#passwordError').css({'width': 'auto', 'display': 'block'}).html('');
        $('#confirmPassword').removeClass('invalidInput');
        $('#confirmPasswordError').css({'width': 'auto', 'display': 'block'}).html('');
      }
    } else {
      if ($('#password').val() === '' && $('#confirmPassword').val() !== '') {
        $('#password').addClass('invalidInput');
        $('#passwordError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
        $('#confirmPassword').removeClass('invalidInput');
        $('#confirmPasswordError').css({'width': 'auto', 'display': 'block'}).html('');
      } else if ($('#password').val() !== '' && $('#confirmPassword').val() === '') {
        $('#password').removeClass('invalidInput');
        $('#passwordError').css({'width': 'auto', 'display': 'block'}).html('');
        $('#confirmPassword').addClass('invalidInput');
        $('#confirmPasswordError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
      } else {
        $('#password').addClass('invalidInput');
        $('#passwordError').css({'width': '85%', 'display': 'inline-block'}).html('The passwords must match each other');
        $('#confirmPassword').addClass('invalidInput');
        $('#confirmPasswordError').css({'width': '85%', 'display': 'inline-block'}).html('The passwords must match each other');
      }
    }
  }
}
