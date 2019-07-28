$(document).ready(function() {
  $('.menuButtonRow-icon').click(function() {
    $('.menuButtonRow').slideToggle(500);
  });
  //Buttons with forms
  $('#btnFindItem').click(function() { scarecrow.get.item.single($('#txtItemSearch').val(), 'wowhead', initItem); });
});

function initItem(item) {
  $('#buttonRow').html('<button id="btnSubmit" type="submit" name="update" value="itemvalue" class="popupContainer-button">Submit</button>');
  //const qualities = ['Poor', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  const slots = ['Head', 'Shoulder', 'Chest', 'Back', 'Wrist', 'Hands', 'Waist', 'Legs', 'Feet', 'Finger', 'Trinket', 'Relic', 'One-Hand', 'Two-Hand', 'Off Hand']

  console.log(item)
  $('#txtLink').html('<a href="https://classic.wowhead.com/item=' + item.id + '" class="clr-' + item.quality.toLowerCase() + '">' + item.name + '</a>');
  $('#txtName').val(item.name);
  $('#txtSlot').val(item.slot);
  $('#txtQuality').val(item.quality);
  $('#txtBaseStats').html('');
  $('#txtMagicalStats').html('');
  $('#txtPhysicalStats').html('');
  $('#txtDefensiveStats').html('');
  $('#txtOtherStats').html('');

  if (!$.isEmptyObject(item.stats.base)) {
    if (item.stats.base.agi) { $('#txtBaseStats').append('<div>' + item.stats.base.agi + ' agility (IV: ' + (item.stats.base.agi*item.coefficients.agi) + ')</div>'); addToLV('#txtLVPhysical', item.stats.base.agi, item.coefficients.agi); }
    if (item.stats.base.int) { $('#txtBaseStats').append('<div>' + item.stats.base.int + ' intellect (IV: ' + (item.stats.base.int*item.coefficients.int) + ')</div>'); addToLV('#txtLVMagical', item.stats.base.int, item.coefficients.int); addToLV('#txtLVHealing', item.stats.base.int, item.coefficients.int); }
    if (item.stats.base.spi) { $('#txtBaseStats').append('<div>' + item.stats.base.spi + ' spirit (IV: ' + (item.stats.base.spi*item.coefficients.spi) + ')</div>'); addToLV('#txtLVHealing', item.stats.base.spi, item.coefficients.spi); }
    if (item.stats.base.sta) { $('#txtBaseStats').append('<div>' + item.stats.base.sta + ' stamina (IV: ' + (item.stats.base.sta*item.coefficients.sta) + ')</div>'); addToLV('#txtLVTanking', item.stats.base.sta, item.coefficients.sta); }
    if (item.stats.base.str) { $('#txtBaseStats').append('<div>' + item.stats.base.str + ' strength (IV: ' + (item.stats.base.str*item.coefficients.str) + ')</div>'); addToLV('#txtLVPhysical', item.stats.base.str, item.coefficients.str); addToLV('#txtLVTanking', item.stats.base.str, item.coefficients.str); }
  }

  if (!$.isEmptyObject(item.stats.magical)) {
    if (item.stats.magical.healing) { $('#txtMagicalStats').append('<div>' + item.stats.magical.healing + ' healing (IV: ' + (item.stats.magical.healing*item.coefficients.hlrpwr) + ')</div>'); addToLV('#txtLVHealing', item.stats.magical.healing, item.coefficients.hlrpwr); }
    if (item.stats.magical.dmg) { $('#txtMagicalStats').append('<div>' + item.stats.magical.dmg + ' damage / healing (IV: ' + (item.stats.magical.dmg*item.coefficients.splpwr) + ')</div>'); addToLV('#txtLVMagical', item.stats.magical.dmg, item.coefficients.splpwr); addToLV('#txtLVHealing', item.stats.magical.dmg,  item.coefficients.splpwr); }
    if (item.stats.magical.dmg_shadow) { $('#txtMagicalStats').append('<div>' + item.stats.magical.dmg_shadow + ' shadow spell damage (IV: ' + (item.stats.magical.dmg_shadow*item.coefficients.splpwr) + ')</div>'); addToLV('#txtLVMagical', item.stats.magical.dmg_shadow, item.coefficients.splpwr); }
    if (item.stats.magical.dmg_fire) { $('#txtMagicalStats').append('<div>' + item.stats.magical.dmg_fire + ' fire spell damage (IV: ' + (item.stats.magical.dmg_fire*item.coefficients.splpwr) + ')</div>'); addToLV('#txtLVMagical', item.stats.magical.dmg_fire, item.coefficients.splpwr); }
    if (item.stats.magical.dmg_frost) { $('#txtMagicalStats').append('<div>' + item.stats.magical.dmg_frost + ' frost spell damage (IV: ' + (item.stats.magical.dmg_frost*item.coefficients.splpwr) + ')</div>'); addToLV('#txtLVMagical', item.stats.magical.dmg_frost, item.coefficients.splpwr); }
    if (item.stats.magical.hit) { $('#txtMagicalStats').append('<div>' + item.stats.magical.hit + ' % spell hit (IV: ' + (item.stats.magical.hit*item.coefficients.splhit) + ')</div>'); addToLV('#txtLVMagical', item.stats.magical.hit, item.coefficients.splhit); }
    if (item.stats.magical.crit) { $('#txtMagicalStats').append('<div>' + item.stats.magical.crit + ' % spell crit (IV: ' + (item.stats.magical.crit*item.coefficients.splcrit) + ')</div>'); addToLV('#txtLVMagical', item.stats.magical.crit, item.coefficients.splcrit); addToLV('#txtLVHealing', item.stats.magical.crit, item.coefficients.splcrit); }
    if (item.stats.magical.mp5) { $('#txtMagicalStats').append('<div>' + item.stats.magical.mp5 + ' mana / 5 sec (IV: ' + (item.stats.magical.mp5*item.coefficients.mp5) + ')</div>'); addToLV('#txtLVHealing', item.stats.magical.mp5, item.coefficients.mp5); }
  }

  if (!$.isEmptyObject(item.stats.physical)) {
    if (item.stats.physical.dps) { $('#txtPhysicalStats').append('<div>' + item.stats.physical.dps + ' dps (IV: ' + (item.stats.physical.dps*item.coefficients.dps) + ')</div>'); addToLV('#txtLVPhysical', item.stats.physical.dps, item.coefficients.dps); }
    if (item.stats.physical.hit) { $('#txtPhysicalStats').append('<div>' + item.stats.physical.hit + ' % melee hit (IV: ' + (item.stats.physical.hit*item.coefficients.melhit) + ')</div>'); addToLV('#txtLVPhysical', item.stats.physical.hit, item.coefficients.melhit); }
    if (item.stats.physical.crit) { $('#txtPhysicalStats').append('<div>' + item.stats.physical.crit + ' % melee crit (IV: ' + (item.stats.physical.crit*item.coefficients.melcrit) + ')</div>'); addToLV('#txtLVPhysical', item.stats.physical.crit, item.coefficients.melcrit); }
  }

  if (!$.isEmptyObject(item.stats.defensive)) {
    if (item.stats.defensive.defense) { $('#txtDefensiveStats').append('<div>' + item.stats.defensive.defense + ' defense (IV: ' + (item.stats.defensive.defense*item.coefficients.defense) + ')</div>'); addToLV('#txtLVTanking', item.stats.defensive.defense, item.coefficients.defense); }
    if (item.stats.defensive.dodge) { $('#txtDefensiveStats').append('<div>' + item.stats.defensive.dodge + ' % dodge (IV: ' + (item.stats.defensive.dodge*item.coefficients.dodge) + ')</div>'); addToLV('#txtLVTanking', item.stats.defensive.dodge, item.coefficients.dodge); }
    if (item.stats.defensive.block_chance) { $('#txtDefensiveStats').append('<div>' + item.stats.defensive.block_chance + ' % block chance (IV: ' + (item.stats.defensive.block_chance*item.coefficients.block) + ')</div>'); addToLV('#txtLVTanking', item.stats.defensive.block_chance, item.coefficients.block); }
    if (item.stats.defensive.block_value) { $('#txtDefensiveStats').append('<div>' + item.stats.defensive.block_value + ' block value (IV: ' + (item.stats.defensive.block_value*item.coefficients.block) + ')</div>'); addToLV('#txtLVTanking', item.stats.defensive.block_value, item.coefficients.block); }
    if (item.stats.defensive.parry) { $('#txtDefensiveStats').append('<div>' + item.stats.defensive.parry + ' % parry (IV: ' + (item.stats.defensive.parry*item.coefficients.parry) + ')</div>'); addToLV('#txtLVTanking', item.stats.defensive.parry, item.coefficients.parry); }
  }

  if (!$.isEmptyObject(item.stats.other)) {
    for (var stat in item.stats.other) {
      $('#txtOtherStats').append('<div>' + item.stats.other[stat] + '</div>');
    }
    $('#txtOtherStats').append('<input id="txtOther" type="number" name="misc" />');
  }

  function addToLV(field, base, coefficient) {
    $(field).val(function(i, val) { return parseFloat(val) + (parseFloat(base)*parseFloat(coefficient)); });
  }
}