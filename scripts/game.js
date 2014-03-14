if (isMobile()) {
  redirect('/');
}

var peer = new Peer({ key: 'z0bavx5ok1emi', debug: 2 });
$('#game_url').hide();

console.log(window.location.hash);

if (window.location.hash === "") {

  // Master of all

  peer.on('open', function (id) {

    var url = window.location.href;
    window.location.hash = id;

    $('#game_url').attr('href', url).show();

  });

  peer.on('connection', function (conn) {
    console.log('test');

    conn.on('open', function() {

      console.log('yay');

      conn.on('data', function(data) {
        console.log(data);
      });

      conn.send('ping');

    });
  });

} else {

  // Enslaved peer

  var peer = new Peer({ key: 'z0bavx5ok1emi', debug: 2 }),
      id = window.location.hash.slice(1),
      conn = peer.connect(id);

  conn.on('open', function() {

    console.log('yay');

    conn.on('data', function(data) {
      console.log(data);
    });

    conn.send('pong');

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
