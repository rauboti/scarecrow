deviceAdjustment();
var clicked;
$(document).ready(function() {
  $('.rolloutContainerBody').hide();
  $('.rolloutController').click(function() {
    //clicked = $(this);
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
  $('#btnEditGeneral').click(function() {
    scarecrow.window.toggle.background();
    scarecrow.window.user.edit(true, $('#txtUsername').text(), $('#txtEmail').text(), false, $('#txtRank').text(), $('#txtRole').text());
  });
  $('#btnAddCharacter').click(function() {
    scarecrow.window.toggle.background();
    scarecrow.window.character.add();
  });
  $('.charContainer-button').click(function() {
    action = $(this).attr('id').split('_')[0];
    character = $(this).val();
    if (action === 'delete') {
      scarecrow.window.toggle.background();
      scarecrow.window.character.delete(character);
    } else if (action === 'edit') {
      scarecrow.window.toggle.background();
      scarecrow.window.character.edit(true, character, $(this).attr('main'));
    }
  });
  $('.quickMenu-button').click(function() {
    clicked = $(this).attr('id').split('btn')[1];
  })

  $('.icon-menu').click(function() {
    $('.menu-button-row').slideToggle(500);
  });
});
