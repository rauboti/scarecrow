$(document).ready(function() {
  $('.menuButtonRow-icon').click(function() {
    $('.menuButtonRow').slideToggle(500);
  });
  
  // DataTables
  $('#tblWishlist').DataTable();

  $('#btnAdd').click(function() {
    scarecrow.window.toggle.background();
    $('body').append('<form id="frmPopup" name="frmPopupWindow" method="post" autocomplete="off"><div id="popupContainer" class="popupContainer">'
    + '<div class="popupContainer-headline">Add to wishlist</div>'
    + '<div class="formContainer-fullColumn"><input id="txtItemSearch" type="text" placeholder="Type to search.." autocomplete="off" /></div>'
    + '<div class="formContainer-fullColumn"><div id="itemList" style="text-align: center;" class="itemList"></div></div>'
    + '<div class="formContainer-buttonRow">'
    + '<button id="btnCancel" type="button" class="action-button">Cancel</button>'
    + '</div>'
    + '</div></form>');
  
    $('#btnCancel').click(function() {
      scarecrow.window.close.popup();
      scarecrow.window.toggle.background();
    });
    //gets available instances and sends the callback to a callback-function
    //scarecrow.get.instances(initInstances)
    var searchTimer;
    $('#txtItemSearch').keyup(function() {
      clearTimeout(searchTimer)
      var query = this.value;
      searchTimer = setTimeout(function() {
        if (query.length > 4) {
          scarecrow.get.item.matches(query, initItems);
        }
      }, 300);
    });
    //var instances;
    //Handles the callback from the instances query
    //function initInstances(response) { instances = response; }
    //Handles the callback from the items query
    function initItems(response) {
      console.log(response)
      $('#itemList').html('');
      for (var item in response) {
        $('#itemList').append('<button type="submit" name="add" value="' + response[item].id + '" class="item">' + response[item].name + '</button>')
        //$('#itemList').append('<a href="https://classic.wowhead.com/item=' + response[item].id + '/" target="_blank"><div class="itemContainer clr-' + response[item].quality + '">' + response[item].name + '</div></a><button type="submit" name="add" value="' + response[item].id + '" class="itemContainer-button iconButton icon-add"></button>')
      }
      $('.itemContainer-button').click(function() {
        clicked = $(this).attr('id').split('btn')[1];
      });
    }
  })
});
