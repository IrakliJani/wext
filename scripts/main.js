window.isMobile = function () {
  return /mobile|android/i.test(navigator.userAgent);
};

window.redirect = function (url) {
  window.location = url;
};

if (isMobile()) {
  $('.desktop-show').hide();
} else {
  $('.mobile-show').hide();
}
