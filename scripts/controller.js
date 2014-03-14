$(function () {
  init();

  function init () {
    var w = $(document).width(),
        h = $(document).height(),
        paper = Raphael(w*0.05, h*0.1, w-w*0.1, h-h*0.1, true);

    var controller = paper.rect(0, 0, w - w*0.1, h - h*0.15);

    controller.attr({
      'fill': '#000'
    });
  };

});
