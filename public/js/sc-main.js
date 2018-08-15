var clicked;
$(document).ready(function() {
  $('.response-button').click(function() {
    clicked = $(this).attr('id').split('btn')[1];
  });
  $('.list-button').click(function() {
    clicked = $(this).attr('id').split('btn')[1];
  });
  $('.signup-input').blur(function() {
    scarecrow._validateSignUp();
  });
  $('.signin-input').blur(function() {
    scarecrow._validateSignIn();
  });
  $('.menu-button-small').click(function() {
    if ($(this).attr('id').split('-')[1] === 'Progression') {
      $('.tblProgression').addClass('hidden');
      $(".boss-" + $(this).attr('id').split('-')[2]).removeClass('hidden');
    } else if ($(this).attr('id').split('-')[1] === 'Applications') {
      $('.tblApplications').addClass('hidden');
      $(".app-" + $(this).attr('id').split('-')[2]).removeClass('hidden');
    }
    $('.menu-button-small').removeClass('menu-button-selected');
    $(this).addClass('menu-button-selected');
  });
});
