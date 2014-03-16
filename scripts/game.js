if (isMobile()) {
  redirect('/');
}

// var peer = new Peer('master', { key: 'z0bavx5ok1emi', debug: 2 });
var peer = new Peer({ key: 'z0bavx5ok1emi', debug: 2 });

$('#game-url').hide();
$('#controller-qr').hide();

$('#select-view').hide();
$('#game-view').hide();

peer.on('open', function (id) {
  QR('controller-qr', id);
  $('#controller-qr').show();
});

peer.on('connection', function (conn) {
  var emitter = new Emitter(conn);

  // black code don't do that, please I'll do that, ok but not in the next time pal, you will be a man someday so that's not right to do
  // window.emitter = emitter;

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
      $('#select-view').show();

      emitter.on('event', function (e) {
        var name = e.name + ':' + e.type;

        console.log(name);

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

          case 'select:down':

            if (window.started) break;

            window.started = true;
            var color = $('#select-view ul li.active').data('color');

            $('#select-view').hide();
            $('#game-view').show();

            initGame(emitter, color);

            break;

        }

      });

    });

  });
});

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

function initGame(emitter, color) {
  var stats = new Stats();
  stats.setMode(0);

  $(stats.domElement).css({
    position: 'absolute',
    right: '0px',
    top: '0px'
  });

  $('body').append(stats.domElement);

  var camera, scene, renderer;

  var invaders;

  init();
  animate();

  function init() {

    console.log(emitter);

    var width = $('#canvas').width(),
        height = $('#canvas').height();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x00);

    renderer.setSize(width, height);
    document.getElementById('canvas').appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);

    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.position.z = 600;

    invaders = new Invaders(emitter, scene, color, width, 3, 10);
    invaders.init();
    invaders.draw();

  }

  function animate() {
    stats.begin();

    renderer.render(scene, camera);
    invaders.animate();

    requestAnimationFrame(animate);
    stats.end();
  }
}
