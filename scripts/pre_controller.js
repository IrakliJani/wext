var isMobile = isMobile();

if (!isMobile) {
  redirect('/');
}

var cameraDefaults = {
  maxWidth : 640,
  maxHeight : 480
}, camera;


function setCamera() {
  if (getOrientation() === 'landscape') {
    camera = {
      maxWidth:  cameraDefaults.maxWidth,
      maxHeight: cameraDefaults.maxHeight
    };
  } else {
    camera = {
      maxWidth:  cameraDefaults.maxHeight,
      maxHeight: cameraDefaults.maxWidth
    };
  }

  $('canvas,video').attr({
    width:  camera.maxWidth / 2,
    height: camera.maxHeight / 2
  });
}

setCamera();

$(window).on('orientationchange', function () {
  setCamera();
});


var scan  = $('#scan'),
  camList = $('#camList');

var video  = $('video'),
    canvas = $('canvas'),
    ctx    = canvas[0].getContext('2d');

var shotsInterval;

MediaStreamTrack.getSources(function (sources) {
  var c = 1;
  sources.forEach(function (source, i) {
    if (source.kind === 'video') {
      camList.append('<option value="' + source.id +'"> Camera ' + (c++) + '</option>');
    }
  });
});

qrcode.success = gotId;


$('#scan').click(function () {
  $(this).hide();
  camList.show();


  getStream();

  shotsInterval = setInterval(function () {
    try {
      ctx.drawImage(video[0], 0, 0);
      try {
        qrcode.decode();
      } catch(e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e.message);
    }
  }, 100);
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

camList.change(function () {
  getStream();
});


function gotUserMedia(stream) {
  video.attr('src', URL ? URL.createObjectURL(stream) : stream);

  window.stream = stream;
}


function gotId(data) {
  alert(data);
}
