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
  $('#controllers').show();
});

var controllers = [];

peer.on('connection', function (conn) {
  var emitter = new Emitter(conn);

  conn.on('close', function () {
    $('#connections div:nth-child('+ (conn.controller + 1) + ')').removeClass('connected').addClass('disconnected').html('Disconnected');
    controllers[conn.controller] = null;
    delete conn.controller;
  });

  conn.on('open', function () {
    if (controllers.length > 2) {
      emitter.emit('error', 'more connections than two');
      conn.close();
    }

    var i = controllers.length;
    controllers[i] = conn;
    conn.controller = i;
    conn.ready = false;

    $('#connections div:nth-child(' + (1 + i) + ')').removeClass('disconnected').addClass('connected').html('Connected');

    if (controllers.length === 2) {
      $('#send-view').hide();
      $('#select-view').show();
    }


    emitter.on('event', function (e) {
      var name = e.name + ':' + e.type;
      var selector = '#player' + (1 + conn.controller) + ' li';

      switch (name) {
        case 'down:down':

          var next = $(selector + '.active')
            .removeClass('active')
            .next();

          if (next.length) {
            next.addClass('active');
          } else {
            $(selector).first().addClass('active');
          }

          break;
        case 'up:down':

          var prev = $(selector + '.active')
            .removeClass('active')
            .prev();

          if (prev.length) {
            prev.addClass('active');
          } else {
            $(selector).last().addClass('active');
          }

          break;

        case 'select:down':

          if (window.started) {
            break;
          }

          conn.ready = true;
          conn.color = $(selector + '.active').data('color');
          
          if (controllers[0].ready && controllers[1].ready) {
            window.started = true;
            var color = $(selector + '.active').data('color');

            $('#select-view').hide();
            $('#game-view').show();

            initGame();

            invaders.initPlayer(controllers[0].color, new Emitter(controllers[0]));
            invaders.initPlayer(controllers[1].color, new Emitter(controllers[1]));

            break;
          }
      }
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

function initGame(color) {

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

    window.invaders = invaders = new Invaders(scene, width, 3, 10);

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
