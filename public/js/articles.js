$(document).ready(function() {
  $('.menuButtonRow-icon').click(function() {
    $('.menuButtonRow').slideToggle(500);
  });

  $('#btnNew').click(function() { showAddArticle(); })
});

function showAddArticle() {
  $('#articleContainer').html('<form method="post" autocomplete="off" enctype="multipart/form-data">'
  + '<div class="formContainer-fullColumn"><span>Title</span><input type="text" name="title" /></div>'
  + '<div class="formContainer-fullColumn"><span>Article</span><textarea name="article"></textarea></div>'
  + '<div class="formContainer-fullColumn"><span>Image</span><input type="file" name="image" /></div>'
  + '<button type="submit" name="action" value="new">Submit</button>'
  + '</form>');
}