var clicked;
$(document).ready(function() {
  scarecrow.get.character.classes(initClasses);

  $('.action-button').click(function() {
    $(this).is('[id]') && (clicked = $(this).attr('id').split('btn')[1]);
  });
  $('.menuButtonRow-icon').click(function() {
    $('.menuButtonRow').slideToggle(500);
  });
  $('.apply-input').blur(function() {
    formValidationMarkup($(this).attr('id'));
  });
});

//  ------------------------------------------------------------ { Classes & roles }
function initClasses(classes) {
  for (var i in classes) {
    $('#frmCharClass').append('<option>' + classes[i].name + '</option>')
  }
  initRoles();
  //Change role dropdown if the Class-dropdown changes
  $('#frmCharClass').change(function() {
    initRoles();
  });
  function initRoles() {
    $('#frmCharRole').html('');
    for (var i in classes) {
      if (classes[i].name === $('#frmCharClass :selected').text()) {
        classes[i].isDamage !== 0 ? $('#frmCharRole').append('<option>Damage</option>') : '';
        classes[i].isSupport !== 0 ? $('#frmCharRole').append('<option>Support</option>') : '';
        classes[i].isTank !== 0 ? $('#frmCharRole').append('<option>Tank</option>') : '';
      }
    }
  }
}

//  ------------------------------------------------------------ { Validation }
function formValidation() {
    if ($('#frmCharName').val() !== '' && $('#frmLevel').val() !== '' && $('#frmSpecLink').val() !== '' && $('#frmArmoryLink').val() !== '' && $('#frmNumberOfRaids').val() !== '' && $('#frmPreparation').val() !== '' && $('#frmValuableAsset').val() !== '' && $('#frmMakingMistake').val() !== '' && $('#frmAnythingElse').val() !== '') {
      return true;
    } else {
      formValidationMarkup('all')
      return false;
    }
}

//  ------------------------------------------------------------ { Visuals }
function formValidationMarkup(field) {

  if (field === 'frmCharName' || field === 'all') {
    if ($('#frmCharName').val() === '') {
      $('#frmCharName').addClass('invalidInput');
      $('#frmCharNameError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
    } else {
      $('#frmCharName').removeClass('invalidInput');
      $('#frmCharNameError').css({'width': 'auto', 'display': 'block'}).html('');
    }
  }

  if (field === 'frmLevel' || field === 'all') {
    if ($('#frmLevel').val() === '') {
      $('#frmLevel').addClass('invalidInput');
      $('#frmLevelError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
    } else {
      $('#frmLevel').removeClass('invalidInput');
      $('#frmLevelError').css({'width': 'auto', 'display': 'block'}).html('');
    }
  }

  if (field === 'frmSpecLink' || field === 'all') {
    if ($('#frmSpecLink').val() === '') {
      $('#frmSpecLink').addClass('invalidInput');
      $('#frmSpecLinkError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
    } else {
      $('#frmSpecLink').removeClass('invalidInput');
      $('#frmSpecLinkError').css({'width': 'auto', 'display': 'block'}).html('');
    }
  }

  if (field === 'frmArmoryLink' || field === 'all') {
    if ($('#frmArmoryLink').val() === '') {
      $('#frmArmoryLink').addClass('invalidInput');
      $('#frmArmoryLinkError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
    } else {
      $('#frmArmoryLink').removeClass('invalidInput');
      $('#frmArmoryLinkError').css({'width': 'auto', 'display': 'block'}).html('');
    }
  }

  if (field === 'frmNumberOfRaids' || field === 'all') {
    if ($('#frmNumberOfRaids').val() === '') {
      $('#frmNumberOfRaids').addClass('invalidInput');
      $('#frmNumberOfRaidsError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
    } else {
      $('#frmNumberOfRaids').removeClass('invalidInput');
      $('#frmNumberOfRaidsError').css({'width': 'auto', 'display': 'block'}).html('');
    }
  }

  if (field === 'frmPreparation' || field === 'all') {
    if ($('#frmPreparation').val() === '') {
      $('#frmPreparation').addClass('invalidInput');
      $('#frmPreparationError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
    } else {
      $('#frmPreparation').removeClass('invalidInput');
      $('#frmPreparationError').css({'width': 'auto', 'display': 'block'}).html('');
    }
  }

  if (field === 'frmValuableAsset' || field === 'all') {
    if ($('#frmValuableAsset').val() === '') {
      $('#frmValuableAsset').addClass('invalidInput');
      $('#frmValuableAssetError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
    } else {
      $('#frmValuableAsset').removeClass('invalidInput');
      $('#frmValuableAssetError').css({'width': 'auto', 'display': 'block'}).html('');
    }
  }

  if (field === 'frmMakingMistake' || field === 'all') {
    if ($('#frmMakingMistake').val() === '') {
      $('#frmMakingMistake').addClass('invalidInput');
      $('#frmMakingMistakeError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
    } else {
      $('#frmMakingMistake').removeClass('invalidInput');
      $('#frmMakingMistakeError').css({'width': 'auto', 'display': 'block'}).html('');
    }
  }

  if (field === 'frmAnythingElse' || field === 'all') {
    if ($('#frmAnythingElse').val() === '') {
      $('#frmAnythingElse').addClass('invalidInput');
      $('#frmAnythingElseError').css({'width': '85%', 'display': 'inline-block'}).html('Field required');
    } else {
      $('#frmAnythingElse').removeClass('invalidInput');
      $('#frmAnythingElseError').css({'width': 'auto', 'display': 'block'}).html('');
    }
  }
}
