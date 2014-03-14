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

var video  = $('video'),
    canvas = $('canvas')

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
  if (window.stream) {
    stream.stop();
    video.attr('src', null);
  }

  var opts = {
    audio : false,
    video : {
      mandatory : camera,
      optional  : [ { sourceId : camList.val() } ]
    }
  };

  navigator.getUserMedia(opts, gotUserMedia, function (error) {
    if (error.name === 'PermissionDeniedError') {
      alert('Permission Denied');
    } else {
      alert('error detected');
    }
  });
}

function gotUserMedia(stream) {
  video[0].src = URL ? URL.createObjectURL(stream) : stream;
  //video.attr('src', URL ? URL.createObjectURL(stream) : stream);

  window.stream = stream;
}
