//setup connection
$(function () {
  // if (window.location.hash.length < 1 || !isMobile()) {
  //   redirect('/');
  // }

  var id = window.location.hash.slice(1),
    peer = new Peer({ key: 'z0bavx5ok1emi', debug: 2 }),
    conn = peer.connect(id),
    emitter = new Emitter(conn),
    acceleration = false;

  conn.on('open', function() {
    emitter.emit('controller');
  });

  window.sendEvent = function (data) {
    if (emitter) {
      emitter.emit('event', data);
    }
  };

  emitter.on('acceleration', function (status, frequency) {
    if (status === 'on' || acceleration === true) {
      gyro.frequency = frequency;
      gyro.startTracking(function (o) {
        sendEvent({
              name : 'acceleration',
              type : 'acceleration',
              data : o
          }, 200);
      });
    } else {
      gyro.stopTracking();
    }
  });

  // davitas teritoria

  draw_things();
  
  // events go wild
  $(document).click(function () {
    launchFullscreen(document.documentElement);
  });

  FastClick.attach(document.body);
 
  //orientation stuff
  if(Math.abs(window.orientation) === 90 || window.orientation === undefined) {
    $('.rotate').hide();
    $('#nespad').show()
  } else {
    $('.rotate').show();
    $('#nespad').hide();
  }

  $(window).on("orientationchange", function() {
    if(Math.abs(window.orientation) === 90) {
      $('.rotate').hide();
      $('#nespad').show()
    } else {
      $('.rotate').show();
      $('#nespad').hide()
    }
  });
  //a and b down
  $('.action-pane .button').on('touchstart mousedown',function (e){
    var data = {
      name: $(this).attr('id'),
      type: 'down'
    };
    sendEvent(data);
    $(this).addClass('action-pane-active');
  });

  //a and b up
  $('.action-pane .button').on('touchend mouseup touchcancel',function (e){
    var data = {
      name: $(this).attr('id'),
      type: 'up'
    };
    sendEvent(data);
    $(this).removeClass('action-pane-active');
  });

  //start and select down
  $('.menu-pane .buttons .button').on('touchstart mousedown',function (e){
    var data = {
      name: $(this).attr('id'),
      type: 'down'
    };
    sendEvent(data);
    $(this).addClass('menu-pane-active');
  });

  //start and select up
  $('.menu-pane .buttons .button').on('touchend mouseup touchcancel',function (e){
    var data = {
      name: $(this).attr('id'),
      type: 'up'
    };
    sendEvent(data);
    $(this).removeClass('menu-pane-active');
  });

  //arrows down
  $('#up, #down, #left, #right').on('touchstart mousedown', function (e) {
    var data = {
      name: $(this).attr('id'),
      type: 'down'
    };
    sendEvent(data);
    e.preventDefault(); 
    $("#dpad").addClass(data.name);
  });

  //arrows up
  $('#up, #down, #left, #right').on('touchend mouseup touchcancel', function (e) {
    var data = {
      name: $(this).attr('id'),
      type: 'up'
    };
    sendEvent(data);
    e.preventDefault(); 
    $("#dpad").removeClass(data.name);
  });
});



function draw_things () {
  /**
   * Add handlers to dpad-buttons
   */
  (function () {
    var canvas = document.getElementById("dpad-body");
    
    function angularShape(canvas, coords) {
      var shape = canvas.getContext("2d"),
      i = 0;
      shape.beginPath();
      shape.moveTo(coords[0][0], coords[0][1]);
      coords.slice(1);
      
      for (i = 0; i < coords.length; i+=1) {
        shape.lineTo(coords[i][0], coords[i][1]);
      }
      
      shape.closePath();
      return shape;
    }
    function linearFill(shape, color1, color2, coords) {
      var bg = shape.createLinearGradient(coords[0], coords[1], coords[2], coords[3]);
      bg.addColorStop(0, color1);
      bg.addColorStop(1, color2);
      shape.fillStyle = bg;
      shape.fill();
    }
    
    function ySide(canvas, y, xFrom, xTo) {
      var shape = angularShape(canvas, [
        [y, xFrom],
        [y + 5, xFrom + 3.5],
        [y + 5, xTo + 3.5],
        [y, xTo]
      ]);
      linearFill(shape, "#666", "#000", [y, xFrom, y + 15, xFrom]);
    }
    
    function xSide(canvas, x, yFrom, yTo) {
      var shape = angularShape(canvas, [
        [yFrom, x],
        [yFrom + 5, x + 3.5],
        [yTo + 5, x + 3.5],
        [yTo, x]
      ]);
      linearFill(shape, "#666", "#000", [yFrom, x, yFrom, x + 15]);
    }
    
    // draw the sides first
    xSide(canvas, 63.5, 0, 100);
    xSide(canvas, 100, 36.5, 63.5);
    ySide(canvas, 63.5, 0, 36.5);
    ySide(canvas, 63.5, 63.5, 100);
    ySide(canvas, 100, 36.5, 63.5);
    
    // draw the d-pad
    var plus = angularShape(canvas, [
      [0, 36.5],
      [36.5, 36.5],
      [36.5, 0],
      [63.5, 0],
      [63.5, 36.5],
      [100, 36.5],
      [100, 63.5],
      [63.5, 63.5],
      [63.5, 100],
      [36.5, 100],
      [36.5, 63],
      [0, 63.5]
    ]);
    
    plus.fillStyle = "#1a1a1a";
    plus.shadowColor = "rgba(0, 0, 0, 0.6)";
    plus.shadowBlur = 15;
    plus.shadowOffsetX = 20;
    plus.shadowOffsetY = 10;
    plus.fill();
  }());

  /**
   * Draw d-pad
   */

  (function () {
    var canvas = document.getElementById("dpad-body");
    
    function angularShape(canvas, coords) {
      var shape = canvas.getContext("2d"),
      i = 0;
      shape.beginPath();
      shape.moveTo(coords[0][0], coords[0][1]);
      coords.slice(1);
      
      for (i = 0; i < coords.length; i+=1) {
        shape.lineTo(coords[i][0], coords[i][1]);
      }
      
      shape.closePath();
      return shape;
    }
    function linearFill(shape, color1, color2, coords) {
      var bg = shape.createLinearGradient(coords[0], coords[1], coords[2], coords[3]);
      bg.addColorStop(0, color1);
      bg.addColorStop(1, color2);
      shape.fillStyle = bg;
      shape.fill();
    }
    
    function ySide(canvas, y, xFrom, xTo) {
      var shape = angularShape(canvas, [
        [y, xFrom],
        [y + 5, xFrom + 3.5],
        [y + 5, xTo + 3.5],
        [y, xTo]
      ]);
      linearFill(shape, "#666", "#000", [y, xFrom, y + 15, xFrom]);
    }
    
    function xSide(canvas, x, yFrom, yTo) {
      var shape = angularShape(canvas, [
        [yFrom, x],
        [yFrom + 5, x + 3.5],
        [yTo + 5, x + 3.5],
        [yTo, x]
      ]);
      linearFill(shape, "#666", "#000", [yFrom, x, yFrom, x + 15]);
    }
    
    // draw the sides first
    xSide(canvas, 63.5, 0, 100);
    xSide(canvas, 100, 36.5, 63.5);
    ySide(canvas, 63.5, 0, 36.5);
    ySide(canvas, 63.5, 63.5, 100);
    ySide(canvas, 100, 36.5, 63.5);
    
    // draw the d-pad
    var plus = angularShape(canvas, [
      [0, 36.5],
      [36.5, 36.5],
      [36.5, 0],
      [63.5, 0],
      [63.5, 36.5],
      [100, 36.5],
      [100, 63.5],
      [63.5, 63.5],
      [63.5, 100],
      [36.5, 100],
      [36.5, 63],
      [0, 63.5]
    ]);
    
    plus.fillStyle = "#1a1a1a";
    plus.shadowColor = "rgba(0, 0, 0, 0.6)";
    plus.shadowBlur = 15;
    plus.shadowOffsetX = 20;
    plus.shadowOffsetY = 10;
    plus.fill();
  }());
};

function launchFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
};
