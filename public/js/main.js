var clicked;
deviceAdjustment();
$(document).ready(function() {
  $('.is-expandable').hide();
  $('.is-clickable').click(function() {
    clicked = $(this);
    if ($(this).parent().parent().next('.is-expandable').hasClass('expanded')) {
      clicked.removeClass('icon-arrow-up');
      clicked.addClass('icon-arrow-down');
      $(this).parent().parent().next('.is-expandable')
        .slideToggle(500)
        .removeClass('expanded');
    } else {
      clicked.removeClass('icon-arrow-down');
      clicked.addClass('icon-arrow-up');
      $(this).parent().parent().next('.is-expandable')
        .slideToggle(500)
        .addClass('expanded');
    }
  });
  $('.submit-button').click(function() {
    clicked = $(this).attr('id').split('btn')[1];
  });



  $('.icon-menu').click(function() {
    $('.menu-button-row').slideToggle(500);
  });

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
