window.isMobile = function () {
  return /mobile|android/i.test(navigator.userAgent);
};

window.redirect = function (url) {
  window.location = url;
};

window.getOrientation = function () {
  return Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

