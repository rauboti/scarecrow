$(document).ready(function() {
  $('.menuButtonRow-icon').click(function() {
    $('.menuButtonRow').slideToggle(500);
  });
  $('#statusFrame').hide();
  scarecrow.get.progression(initProgression);
});

function initProgression(progression) {
  for (var instance in progression) {
    var defeated = 0;
    for (var boss in progression[instance]) {
      if (progression[instance][boss].status === 'Defeated') { defeated++ }
    }
    $('#slctInstance').append('<option value="' + instance + '">' + instance + ' (' + defeated + '/' + progression[instance].length +')</option>')
  }
  $('#slctInstance').change(function() {
    $('#statusFrame').slideUp(500, function() {
      $('#statusFrame').html('').removeClass('formContainer');
      for (var boss in progression[$('#slctInstance :selected').val()]) {
        $('#statusFrame').append('<div class="bossContainer"><div class="bossContainer-name">' + progression[$('#slctInstance :selected').val()][boss].name + '</div><div class="bossContainer-status">' + progression[$('#slctInstance :selected').val()][boss].status + '</div></div>');
      }
      if ($('#statusFrame').html() !== '') {
        $('#statusFrame').addClass('formContainer').slideDown(500);
      }
    });
  });
}
