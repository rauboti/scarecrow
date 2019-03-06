var wishlists;

$(document).ready(function() {
  $('.menuButtonRow-icon').click(function() {
    $('.menuButtonRow').slideToggle(500);
  });
  scarecrow.get.character.classes(initClasses);
  scarecrow.get.wishlist('all', function(wl) { wishlists = wl; })
  scarecrow.get.items('all', initItems);
  scarecrow.get.lootValue(initLootValue);
  $('#frmItems').change(initLootValue);
});

function initLootValue(lv) {
  var checked = false;
  $('#formLootValue').html('<div class="formContainer-triColumn">Player</div><div class="formContainer-triColumn">Value</div><div class="formContainer-triColumn">%</div>')
  Array.isArray(lv) && (list = lv);
  $('.chkClassFilter').each(function() { $(this).prop('checked') && (checked = true); });

  for (var i in list) {
    var keep;
    if ($('#chk' + list[i].class).prop('checked') || !checked) {
      if ($('#frmItems :selected').text() === '') {
        keep = true;
      } else {
        if (wishlists[list[i].id]) {
          wishlists[list[i].id].includes(parseInt($('#frmItems :selected').val())) ? keep = true : keep = false
        } else {
          keep = false;
        }
      }

      if (keep) {
        var p = (list[i].value/list[list.length-1].value*100);
        $('#formLootValue').append('<div class="formContainer-triColumn clr' + list[i].class + '">' + list[i].player + '</div>'
        + '<div class="formContainer-triColumn">' + list[i].value + '</div>'
        + '<div class="formContainer-triColumn"><div class="lvBar-outter"><div id="bar' + list[i].player + '" class="lvBar-inner"></div></div><span class="lvBar-text">' + p.toFixed(1) + ' %</span></div>');
        $('#bar' + list[i].player).css({ width: p+'%' })
      }
    }
  }
}

function initClasses(classes) {
  for (var i in classes) {
    $('#classFilters').append('<div class="formContainer-quarterColumn clr' + classes[i].name + '"><input id="chk' + classes[i].name + '" class="chkClassFilter" value="' + classes[i].name.toLowerCase() + '" type="checkbox">' + classes[i].name + '</div>')
  }
  $('.chkClassFilter').click(initLootValue)
}
function initItems(items) {
  for (var i in items) {
    $('#frmItems').append('<option value="' + items[i].id + '">' + items[i].name + '</option>')
  }
}
