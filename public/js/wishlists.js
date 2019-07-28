$(document).ready(function() {
  $('.menuButtonRow-icon').click(function() {
    $('.menuButtonRow').slideToggle(500);
  });
  $('#tblWishlist').DataTable();
  $('#slctWishlist').change(function() {
    $('#slctWishlist option:selected').val() !== '' && scarecrow.get.wishlist($('#slctWishlist option:selected').val(), initWishlist)
  });
});

function initWishlist(wl) {
  $('#frmWishlist').html('<table id="tblWishlist" class="stripe hover row-border"><thead><tr><th>Slot</th><th>Zone</th><th>Item</th></tr></thead><tbody></tbody></table>');
  for (var i in wl ) {
    $('#tblWishlist > tbody').append('<tr>'
    + '<td>' + wl[i].slot + '</td>'
    + '<td>' + wl[i].instance + '</td>'
    + '<td><a href="https://classic.wowhead.com/item=' + wl[i].item  + '/" target="_blank" class="clr-' + wl[i].quality + '">' + wl[i].name + '</a></td>'
    + '</tr>');
  }
  $('#tblWishlist').DataTable();
}