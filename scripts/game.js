if (isMobile()) {
  redirect('/');
}

$('#game_url').hide();

var peer = new Peer({ key: 'z0bavx5ok1emi', debug: 2 });

peer.on('open', function(id) {

  var url = window.location.href;

  window.location.hash = id;

  new QRCode('game_qr', {
    text: url,
    width: 232,
    height: 232,
    colorDark: '#000000',
    colorLight: '#F2F2F2',
    correctLevel: QRCode.CorrectLevel.H
  });


  $('#game_url').attr('href', url).show();

});
