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
    $('menu').addClass('menu-mobile');
    $('nav').addClass('nav-mobile');
    $('section').addClass('section-mobile');
    $('.button-icon-medium').addClass('button-icon-medium-mobile');
    $('.container').addClass('container-mobile');
    $('.hover-highlighted').addClass('hover-highlighted-mobile');
    $('.title').addClass('title-mobile');
    $('.sub-container').addClass('sub-container-mobile');
    $('.subtitle').addClass('subtitle-mobile');
  } else {
    $('menu').addClass('menu-desktop');
    $('nav').addClass('nav-desktop');
    $('section').addClass('section-desktop');
    $('.button-icon-medium').addClass('button-icon-medium-desktop');
    $('.container').addClass('container-desktop');
    $('.hover-highlighted').addClass('hover-highlighted-desktop');
    $('.title').addClass('title-desktop');
    $('.sub-container').addClass('sub-container-desktop');
    $('.subtitle').addClass('subtitle-desktop');
  }
}
