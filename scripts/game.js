if (isMobile()) {
  redirect('/');
}

var peer = new Peer({ key: 'z0bavx5ok1emi', debug: 2 });

$('#game_url').hide();
$('#controller_qr').hide();

if (window.location.hash === "") {

  // Master of all

  var worker = new Worker('scripts/worker.js');

  peer.on('open', function (id) {

    var url = window.location.href;
    window.location.hash = id;

    $('#game_url').attr('href', url).show();
    QR('controller_qr', id);
    $('#controller_qr').show();

  });

  peer.on('connection', function (conn) {
    var emitter = new Emitter(conn);

    conn.on('open', function () {
      var type;
      emitter.on('ready', function () {
        $('#game_url').hide();
      });

      emitter.on('controller', function () {
        emitter.on('event', function (e) {
          console.log(e.name + ':' + e.type);
        });
      });
    });
  });

} else {

  // Enslaved peer

  var peer = new Peer({ key: 'z0bavx5ok1emi', debug: 2 }),
      id = window.location.hash.slice(1),
      conn = peer.connect(id),
      emitter = new Emitter(conn);

  peer.on('open', function (id) {
    QR('controller_qr', id);
  });

  conn.on('open', function() {
    emitter.emit('ready');
    $('#controller_qr').show();
  });

}

function QR(selector, text) {
  new QRCode(selector, {
    text: text,
    width: 232,
    height: 232,
    colorDark: '#000000',
    colorLight: '#F2F2F2',
    correctLevel: QRCode.CorrectLevel.H
  });
}
