var wishlists;

$(document).ready(function() {
  $('.menuButtonRow-icon').click(function() {
    $('.menuButtonRow').slideToggle(500);
  });
  scarecrow.get.wishlist('allfixed', initWishlists);
});

function initWishlists(wl) {
  console.log(wl)
  for (var char in wl) {
    $('#slctWishlist').append('<option value="' + char + '">' + char + '</option>');
  }

  $('#slctWishlist').change(function() {
    $('#frmWishlist').html('')
    for (var item in wl[$('#slctWishlist option:selected').text()]) {
      $('#frmWishlist').append('<a href="https://classic.wowhead.com/item=' + wl[$('#slctWishlist option:selected').text()][item]["id"] + '" target="_blank"><div class="itemContainer">' + wl[$('#slctWishlist option:selected').text()][item]["name"] + '</div></a>');
    }
  });
}