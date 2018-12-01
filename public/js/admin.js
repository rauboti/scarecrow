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
  $('#btnAddEvent').click(function() {
    scarecrow.window.toggle.background();
    scarecrow.window.event.add();
  });
  var searchTimer;
  $('#txtUserSearch').keyup(function() {
    clearTimeout(searchTimer)
    var query = this.value;
    searchTimer = setTimeout(function() {
      if (query.length > 2) {
        scarecrow.get.users(query, initUsers);
      }
    }, 300);
  });

  $('.icon-menu').click(function() {
    $('.menu-button-row').slideToggle(500);
  });
});

function initUsers(users) {
  console.log(users)
  $('#userList').html('');
  for (var user in users) {
    if (users[user].role !== '') { users[user].role = '(' + users[user].role + ')'; }
    $('#userList').append('<a href="/admin/user/' + users[user].id +'"><div class="userContainer"><div class="userContainer-user">' + users[user].name + '</div><div class="userContainer-guildPosition"><div class="userContainer-rank">' + users[user].rank + '</div><div class="userContainer-role">' + users[user].role + '</div></div></div></a>');
  }
}
