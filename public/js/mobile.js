var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

function deviceAdjustment() {
  if( isMobile.any() ) {
    //Fading out before changes are done
    //$('section').hide();

    $('img').addClass('img-mobile');
    $('input').addClass('input-mobile');
    $('menu').addClass('menu-mobile');
    $('nav').addClass('nav-mobile');
    $('section').addClass('section-mobile');
    $('select').addClass('select-mobile');
    $('textarea').addClass('textarea-mobile');
    $('.button-icon-medium').addClass('button-icon-medium-mobile');
    $('.button-icon-small').addClass('button-icon-small-mobile');
    $('.container-page').addClass('container-page-mobile');
    $('.container-big').addClass('container-big-mobile');
    $('.container-medium').addClass('container-medium-mobile');
    $('.container-small').addClass('container-small-mobile');
    $('.hover-highlighted').addClass('hover-highlighted-mobile');
    $('.menu-button-row').addClass('menu-button-row-mobile');
    $('.menu-button-row').children('a').children('menu-button').addClass('menu-button-mobile');
    $('.title').addClass('title-mobile');
    $('.subtitle').addClass('subtitle-mobile');

    //Fading back in after changes are done, to decrease visible resizing at load
    //$('section').fadeIn();

    //Hiding desktop-only elements
    $('.show-desktop').hide();
  } else {
    //Fading out before changes are done
    //$('section').hide();

    $('img').addClass('img-desktop');
    $('input').addClass('input-desktop');
    $('menu').addClass('menu-desktop');
    $('nav').addClass('nav-desktop');
    $('section').addClass('section-desktop');
    $('select').addClass('select-desktop');
    $('textarea').addClass('textarea-desktop');
    $('.button-icon-medium').addClass('button-icon-medium-desktop');
    $('.button-icon-small').addClass('button-icon-small-desktop');
    $('.container-page').addClass('container-page-desktop');
    $('.container-big').addClass('container-big-desktop');
    $('.container-medium').addClass('container-medium-desktop');
    $('.container-small').addClass('container-small-desktop');
    $('.hover-highlighted').addClass('hover-highlighted-desktop');
    $('.menu-button-row').children('a').children('menu-button').addClass('menu-button-desktop');
    $('.menu-button-row').children('a').addClass('is-inline-flex');
    $('.title').addClass('title-desktop');
    $('.subtitle').addClass('subtitle-desktop');
    $('.show-desktop').addClass('is-inline');

    //Fading back in after changes are done, to decrease visible resizing at load
    //$('section').fadeIn();

    //Hiding mobile-only elements
    $('.show-mobile').hide();
  }
  $('html').removeClass('is-hidden');
}
