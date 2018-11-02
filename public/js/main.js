deviceAdjustment();
var clicked;
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
    $(this).is('[id]') && (clicked = $(this).attr('id').split('btn')[1]);
  });
  $('.icon-menu').click(function() {
    $('.menu-button-row').slideToggle(500);
  });
});
