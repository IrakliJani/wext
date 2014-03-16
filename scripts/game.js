if (isMobile()) {
  redirect('/');
}

var peer = new Peer('master', { key: 'z0bavx5ok1emi', debug: 2 });

$('#game-url').hide();
$('#controller-qr').hide();


//$('#send-view').hide();
//$('#select-view').hide();


$('#game-view').hide();

if (window.location.hash === "") {

  // Master of all

  peer.on('open', function (id) {

    var url = window.location.href;
    window.location.hash = id;

    $('#game-url').attr('href', url).show();
    QR('controller-qr', id);
    $('#controller-qr').show();

  });

  peer.on('connection', function (conn) {
    var emitter = new Emitter(conn);

    conn.on('open', function () {
      var type;
      emitter.on('peerConnected', function () {
        $('#game_url').hide();
      });

      emitter.on('ready', function () {
        alert('other peer is ready, you\'re the last');
      });

      emitter.on('controller', function () {

        $('#send-view').hide();

        emitter.on('event', function (e) {
          var name = e.name + ':' + e.type;

          switch (name) {
            case 'down:down':

              var next = $('#select-view ul li.active')
                .removeClass('active')
                .next();

              if (next.length) {
                next.addClass('active');
              } else {
                $('#select-view ul li').first().addClass('active');
              }

              break;
            case 'up:down':

              var prev = $('#select-view ul li.active')
                .removeClass('active')
                .prev();

              if (prev.length) {
                prev.addClass('active');
              } else {
                $('#select-view ul li').last().addClass('active');
              }

              break;
          }








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
    QR('controller-qr', id);
  });

  peer.on('connection', function (conn) {
    var ctrl_emitter = new Emitter(conn);

    conn.on('open', function () {
      ctrl_emitter.on('controller', function () {
        emitter.emit('ready');
        ctrl_emitter.on('event', function (e) {
          console.log(e.name + ':' + e.type);

          if (e.type === 'acceleration') {
            console.log(e.data);
          }
        });
      });
    });
  });

  conn.on('open', function() {
<<<<<<< HEAD
    emitter.emit('peerConnected');
    $('#controller_qr').show();
=======
    emitter.emit('ready');
    $('#controller-qr').show();
>>>>>>> 4d5961758e97715de88502a4b17baa6b1db32f30
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
