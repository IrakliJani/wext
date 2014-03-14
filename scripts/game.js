if (isMobile()) {
  redirect('/');
}

var peer = new Peer({ key: 'z0bavx5ok1emi', debug: 2 });
$('#game_url').hide();

if (window.location.hash === "") {

  // Master of all

  peer.on('open', function (id) {

    var url = window.location.href;
    window.location.hash = id;

    $('#game_url').attr('href', url).show();

  });

  peer.on('connection', function (conn) {
    conn.on('open', function () {
      var emitter = new Emitter(conn);

      emitter.on('masteras_dideba', function (mshvidoba, sulta, chventa) {
        console.log(mshvidoba, sulta, chventa);
      });

      emitter.emit('slaves_gineba', 'arakaco', 'roskipo', 'murtazo');
    });
  });

} else {

  // Enslaved peer

  var peer = new Peer({ key: 'z0bavx5ok1emi', debug: 2 }),
      id = window.location.hash.slice(1),
      conn = peer.connect(id),
      emitter = new Emitter(conn);

  conn.on('open', function() {

    emitter.on('slaves_gineba', function (erti, ori, sami) {
      console.log(erti, ori, sami);
    });

    emitter.emit('masteras_dideba', 'didi', 'tepshit', 'mtxle');

  });

}




// new QRCode('controller_qr', {
//   text: url,
//   width: 232,
//   height: 232,
//   colorDark: '#000000',
//   colorLight: '#F2F2F2',
//   correctLevel: QRCode.CorrectLevel.H
// });
