function Invaders (scene, color, width, rows, bricks_in_row) {



  this.width = width; // canvas width;
  this.scene = scene;

  // rows and bricks
  this.rows = rows;
  this.bricks_in_row = bricks_in_row;

  // brick and gap size between brick
  this.size = 20;
  this.gap = 20;

  // materials and geometry
  this.material = new THREE.MeshNormalMaterial();

  this.geometry = new THREE.BoxGeometry(this.size, this.size, 10);

  // let's group some invaders
  this.all = [];

  this.group = new THREE.Object3D();
  this.bullets = new THREE.Object3D();

  switch (color) {
    case 'red':
      this.color = 0xFF0000;
      break;
    case 'green':
      this.color = 0x00FF00;
      break;
    case 'blue':
      this.color = 0x0000FF;
      break;
  }

  this.players = new THREE.Object3D();

}

Invaders.prototype.init = function () {

  var self = this;

  self.initInvaders();
  //self.initBullet();

};

Invaders.prototype.initInvaders = function () {

  var geometry = new THREE.BoxGeometry(this.size, this.size, 10);
  var y = 0;

  for (var i = 0; i < this.rows; i++) {

    var group = new THREE.Object3D();

    for (var c = 0; c < this.bricks_in_row; c++) {
      var mesh = new THREE.Mesh(geometry, this.material);
      
      mesh.position.x += c * (this.gap + this.size);
      mesh.position.y += y;

      this.all.push(mesh);

      group.add(mesh);
    }

    group.move = 0;

    y -= this.gap * 2;

    this.group.add(group);
  }

  // align positions
  for (var i = 0; i < this.group.children.length; i++) {
    if (i % 2 == 0) {
      this.group.children[i].direction = 'left';
    } else {
      this.group.children[i].direction = 'right';
      this.group.children[i].position.x += this.gap * 2;
    }
  }

};

Invaders.prototype.initPlayer = function (color, emitter) {

  var self = this;

  var geometry = new THREE.BoxGeometry(self.size / 2, self.size / 2, 5);
  var material = new THREE.MeshBasicMaterial({ color: color });

  defenser = new THREE.Object3D;

  var mesh1 = new THREE.Mesh(geometry, material);
  var mesh2 = new THREE.Mesh(geometry, material);
  var mesh3 = new THREE.Mesh(geometry, material);
  mesh1.position.x -= 10;
  mesh2.position.y += 10;
  mesh3.position.x += 10;
  defenser.add(mesh1);
  defenser.add(mesh2);
  defenser.add(mesh3);

  if (self.players.children.length === 0) {
    defenser.position.x -= 20;
  } else {
    defenser.position.x += 20;
  }

  self.players.add(defenser);

  defenser.position.y = -220;

  emitter.on('event', function (data) {
    var name = data.name + ':' + data.type;

    switch (name) {
      case 'left:down':
        defenser.direction = 'left';
        break;
      case 'right:down':
        defenser.direction = 'right';
        break;
      case 'left:up':
      case 'right:up':
        defenser.direction = '';
    }

  });

};

Invaders.prototype.initBullet = function (emitter, defenser) {

  var self = this;

  emitter.on('event', function (data) {
    var name = data.name + ':' + data.type;

    switch (name) {
      case 'a:down':
      case 'b:down':
        if (! self.emitter.bullet)
          self.throwBullet(defenser);
    }

  });

};

Invaders.prototype.throwBullet = function (defenser) {

  var self = this;

  if (! defenser.bullet) return;

  var geometry = new THREE.BoxGeometry(self.size / 4, self.size / 2, 5);
  var material = new THREE.MeshBasicMaterial({ color: 0xFECD5A });

  var bullet = new THREE.Mesh(geometry, material);

  bullet.position.y = -200;
  bullet.position.x = defenser.position.x;

  self.bullets.add(bullet);

  self.scene.add(self.bullets);

};

Invaders.prototype.draw = function () {

  this.group.position.x -= 200;
  this.group.position.y += 200;

  this.scene.add(this.group);
  this.scene.add(this.players);

};

// animate

Invaders.prototype.animate = function () {

  var self = this;

  if (! self.end) {
    self.animateInvaders();
    self.animateDefenser();

    self.animateBullet();
    self.collideBullet();

    self.testLoose();
    self.testWin();
  }

};

Invaders.prototype.animateDefenser = function () {

  for (var i = 0; i < 2; i++) {
    var defenser = this.players.children[i];

    if (! defenser) return;

    if (defenser.direction === 'left' && defenser.position.x > -200) {
      defenser.position.x -= 3;
    } else if (defenser.direction === 'right' && defenser.position.x < 200) {
      defenser.position.x += 3;
    }
  }

};

Invaders.prototype.animateInvaders = function () {
  var rows = this.group.children;
  
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];

    if (row.move === this.gap * 2) {
      row.move = 0;
      row.direction = (row.direction === 'left') ? 'right' : 'left';
    }

    row.position.x += row.direction === 'left' ? 1 : -1;
    row.position.y -= .1;

    row.move += 1;
  }
};

Invaders.prototype.destroyInvader = function (mesh) {

  var self = this;

  mesh.visible = false;
  self.scene.remove(mesh);

  for (var i = 0; i < self.group.children.length; i++) {
    var row = self.group.children[i];
    row.remove(mesh);
  }

  self.all = self.all.filter(function (invader) {
    return invader.id !== mesh.id;
  });
};

Invaders.prototype.destroyBullet = function (mesh) {

  var self = this;

  mesh.visible = false;
  self.scene.remove(mesh);
  self.bullet = null;

};

Invaders.prototype.animateBullet = function () {

  console.log('animate bullets');

  var self = this;

  if (! self.bullet) return

  self.bullet.position.y += 5;

  if (self.bullet.position.y > 220) {
    self.destroyBullet(self.bullet);
    return;
  }

};

Invaders.prototype.collideBullet = function () {

  // TODO;
  return;

  var self = this;

  if (! self.bullet) return;

  // master of all, collisionmaster

  var originPoint = self.bullet.position.clone();

  for (var vertexIndex = 0; vertexIndex < self.bullet.geometry.vertices.length; vertexIndex++) {

    var localVertex = self.bullet.geometry.vertices[vertexIndex].clone();
    var globalVertex = localVertex.applyMatrix4(self.bullet.matrix);
    var directionVector = globalVertex.sub(self.bullet.position);

    var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
    var collisionResults = ray.intersectObjects(self.all);

    if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {

      var mesh = collisionResults[0].object;

      // remove invader
      self.destroyInvader(mesh);

      // remove bullet
      self.destroyBullet(self.bullet);

      break;
    }

  }

};

Invaders.prototype.testWin = function () {

  var self = this;

  if (self.all.length === 0) {
    console.log('you win');
  }

};

Invaders.prototype.testLoose = function () {

  var self = this;

  for (var i = 0; i < self.group.children.length; i++) {
    var row = self.group.children[i];

    if (row.children.length === 0) continue;

    if (row.position.y <= -305) {
      console.log('you loose');
    }
  }

};

Invaders.prototype.stop = function () {

  var self = this;

  self.end = true;

};

