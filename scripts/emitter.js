function Emitter(conn) {
  this.conn = conn;
}

Emitter.prototype.emit = function (name) {

  var args = Array.prototype.slice.call(arguments, 1),
      data = {
        name: name,
        args: args
      };

  this.conn.send(data);
};

Emitter.prototype.on = function (name, fn) {
  this.conn.on('data', function (data) {

    if (name == data.name) {
      fn.apply(fn, data.args);
    }
  });
};
