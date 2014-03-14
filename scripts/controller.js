$(function () {
  $('body').click(function () {
    launchFullscreen(document.documentElement);  
  });
  

  if(Math.abs(window.orientation) === 90 || window.orientation === undefined) {
    $('.rotate').hide();
    $('.controller').show()
  } else {
    $('.rotate').show();
    $('.controller').hide()
  }

  window.addEventListener("orientationchange", function() {
    if(Math.abs(window.orientation) === 90) {
      $('.rotate').hide();
      $('.controller').show()
    } else {
      $('.rotate').show();
      $('.controller').hide()
    }
  }, false);

  function launchFullscreen(element) {
    if(element.requestFullscreen) {
      element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };
});


