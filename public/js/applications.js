deviceAdjustment();
var clicked;
$(document).ready(function() {
  $('.rolloutContainerBody').hide();
  $('.rolloutController').click(function() {
    clicked = $(this).attr('id').split('Show')[1]
    if ($('#rollout' + clicked).hasClass('expanded')) {
      $('#btnShow' + clicked).addClass('icon-arrow-down').removeClass('icon-arrow-up');
      $('#rollout' + clicked)
        .slideToggle(500)
        .removeClass('expanded');
    } else {
      $('#btnShow' + clicked).addClass('icon-arrow-up').removeClass('icon-arrow-down');
      $('#rollout' + clicked)
        .slideToggle(500)
        .addClass('expanded');
    }
  });
  $('.icon-menu').click(function() {
    $('.menu-button-row').slideToggle(500);
  });
});
