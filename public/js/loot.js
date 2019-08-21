$(document).ready(function() {
  $('.menuButtonRow-icon').click(function() {
    $('.menuButtonRow').slideToggle(500);
  });

  $('#btnRules').click(showRules);

  scarecrow.get.lootValue(initLootValue);
  scarecrow.get.wishlist('items', initItemFilter);
});

function initLootValue(lv) {
  $('#frmLootValue').html('<table id="tblLootValue" class="stripe hover row-border">'
  + '<thead><tr><th>Player</th><th></th><th>Score</th></tr></thead>'
  + '<tbody></tbody></table>');

  for (var i in lv) {
    $('#tblLootValue tbody').append('<tr id="' + lv[i].id + '" class="playerRow" ">'
    + '<td style="width: 50%;" class="clr' + lv[i].class +'">' + lv[i].player + '</td>'
    + '<td style="width: 40%; text-align: right;"><div class="lvBar" style="width: ' + lv[i].value/lv[lv.length-1].value*100 +'%"></div></td>'
    + '<td style="width: 10%;"><span class="lvBar-text">' + lv[i].value + '<span></td>'
    + '</tr>')
  }

  $('#tblLootValue > tbody > tr').hover(function() {
    $('#tblLootValue > tbody > tr').css({"opacity": .25});
    $(this).css({"opacity": 1})
  }, function() {
    $('#tblLootValue > tbody > tr').css({"opacity": 1});
  });
}

function showRules() {
  scarecrow.window.toggle.background();
  $('body').append('<div id="frmPopup" class="popupContainer">'
  + '<div class="popupContainer-headline">Loot Rules</div>'
  + '<div class="formContainer-fullColumn">Our loot system breaks down each item into a value based on stats, depending on the role (tank, healer, physical dps or caster). The value is calculated loosely, not considering how the value might differ from class to class or secondary stat caps.<br><br>Each character will have a score, being the sum value from all items received, divided by their attendance. The character with the lowest score will automatically be the character most deserving of the next item. This removes loot council bias and it is more fair than a regular dkp system where items are priced equally no matter how good they are.</div>'
  + '<button id="btnClose">Close</button>'
  + '</div>');

  $('#btnClose').click(function() {
    scarecrow.window.close.popup();
    scarecrow.window.toggle.background();
  });
}

function initItemFilter(items) {
  if ($('#slctItems').length !== 0) {
    $('#slctItems').change(function() {
      if ($('#slctItems option:selected').val() !== '') {
        $('.playerRow').hide();
        if ($('#slctItems option:selected').val() in items) {
          for (var player in items[$('#slctItems option:selected').val()]) {
            $('#' + items[$('#slctItems option:selected').val()][player]).show();
          }
        }        
      } else {
        $('.playerRow').show();
      }
    });
  }
}