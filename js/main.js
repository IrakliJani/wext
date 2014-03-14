$(function () {
  var w = window.innerWidth,
      h = window.innerHeight;
      paper = Raphael(w*0.05, h*0.1, w, h, true);

    paper.setSize('100%', '100%');

  var controller = paper.rect(0, 0, w - w*0.1, h - h*0.15);

  controller.attr({
    'fill': '#000'
  });
});
