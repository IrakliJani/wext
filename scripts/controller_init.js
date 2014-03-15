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

  $('video,canvas').attr({
    width:  camera.maxWidth,
    height: camera.maxHeight
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

qrcode.callback = gotId;


$('#scan').click(function () {
  $(this).hide();
  camList.show();


  getStream();

  setTimeout(captureScreenshot());
  function captureScreenshot() {
    if(!ctx) {
      alert('Your browser does not even support canvas.. go upgrade your browser');
      return;
    }

    try {
      ctx.drawImage(video[0],0,0);
      try {
          qrcode.decode();
      }
      catch(e){       
          console.log(e);
          setTimeout(captureScreenshot, 500);
      };
    }
    catch(e){       
        console.log(e);
        setTimeout(captureScreenshot, 500);
    };
  }
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


function gotId(id) {
  video.attr('src', '');
  window.stream.stop();
  redirect('/controller#' + id);
}
