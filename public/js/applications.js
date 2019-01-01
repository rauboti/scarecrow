var clicked;
$(document).ready(function() {
  $('.appStatusContainerBody').hide();
  $('.appStatusContainerHead-button').click(function() {
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
  $('.menuButtonRow-icon').click(function() {
    $('.menuButtonRow').slideToggle(500);
  });
});
