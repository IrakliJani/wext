var isMobile = isMobile();

if (!isMobile) {
  //redirect('/');
}

var camera = {
  minWidth : 640,
  minHeight : 480
};

var scan  = $('#scan'),
  camList = $('#camList');

MediaStreamTrack.getSources(function (sources) {
  var c = 1;
  sources.forEach(function (source, i) {
    if (source.kind === 'video') {
      camList.append('<option value="' + sources.id +'"> Camera ' + (c++) + '</option>');
    }
  });
});


$('#scan').click(function () {
  $(this).hide();
  camList.show();

  'canvas,video'.split(',').forEach(function (elem, i) {
    $(elem).attr({
      width:  camera.minWidth,
      height: camera.minHeight
    });
  });

  getStream();
});

function getStream() {
  var opts = {

  };
}
