var clicked;
$(document).ready(function() {
  $('.action-button').click(function() {
    $(this).is('[id]') && (clicked = $(this).attr('id').split('btn')[1]);
  });
  $('.menuButtonRow-icon').click(function() {
    $('.menuButtonRow').slideToggle(500);
  });
  scarecrow.get.application(initApp);
});

function initApp(appData) {
  console.log(appData)
  var buttons = '<button type="submit" name="back" value="back" class="action-button">< Back</button></button>'

  if (appData.general.status === 'New' || appData.general.status === 'Declined') {
    buttons += '<button type="submit" name="accept" value="accept" class="action-button">Accept</button>'
  }
  if (appData.general.status === 'New' || appData.general.status === 'Accepted') {
    buttons += '<button type="submit" name="decline" value="decline" class="action-button">Decline</button>'
  }

  $('#appDataContainer').html('<div class="formContainer">' + appData.general.name + ' - Level ' + appData.general.level + ' ' + appData.general.spec + ' ' + appData.general.class + ' (' + appData.general.role + ')</div>'
    + '<div class="formContainer">'
    + '<button id="btnGeneral" type="button" class="subMenuButton selected">General info</button>'
    + '<button id="btnGear" type="button" class="subMenuButton">Current gear</button>'
    + '<button id="btnProgress" type="button" class="subMenuButton">Raid experience</button></div>'
    + '<div id="appDetailContainer" class="formContainer"><div><b># Armory profile</b></div>'
    + '<div><a href="https://worldofwarcraft.com/en-gb/character/eu/' + appData.general.server + '/' + appData.general.name + '" target="_blank"><u>Link</u></a></div><br><br>'
    + '<div><b># Raids / week</b></div>'
    + '<div style="white-space: pre-wrap;">' + appData.general.raids + '</div><br><br>'
    + '<div><b># Raid preparations</b></div>'
    + '<div style="white-space: pre-wrap;">' + appData.general.prep + '</div><br><br>'
    + '<div><b># About the applicant and why he/she is applying</b></div>'
    + '<div style="white-space: pre-wrap;">' + appData.general.why + '</div></div>'
    + '<div class="formContainer"><form name="frmApplication" method="post">'
    + buttons
    + '</form></div>');

  $('.subMenuButton').click(function() {
    $('.subMenuButton').removeClass('selected')
    $(this).addClass('selected');
    
    $('#appDetailContainer').html('');
    if ($(this).attr('id') === 'btnGear') {
      for (var i in appData.items) {
        $('#appDetailContainer').append('<div><span><strong>' + i.slice(0,1).toUpperCase() + i.slice(1) + ':</strong></span> <span>' + appData.items[i].name + '</span></div>')
      }  
    } else if ($(this).attr('id') === 'btnGeneral') {
      $('#appDetailContainer').html('<div><b># Armory profile</b></div>'
      + '<div><a href="https://worldofwarcraft.com/en-gb/character/eu/' + appData.general.server + '/' + appData.general.name + '" target="_blank"><u>Link</u></a></div><br><br>'
      + '<div><b># Raids / week</b></div>'
      + '<div style="white-space: pre-wrap;">' + appData.general.raids + '</div><br><br>'
      + '<div><b># Raid preparations</b></div>'
      + '<div style="white-space: pre-wrap;">' + appData.general.prep + '</div><br><br>'
      + '<div><b># About the applicant and why he/she is applying</b></div>'
      + '<div style="white-space: pre-wrap;">' + appData.general.why + '</div></div>');
    }
  });
}

