var isMobile = isMobile();

if (!isMobile) {
  //redirect('/');
}

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


$("#scan").click(function () {
  $(this).hide();
  camList.show();
});
