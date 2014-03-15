function Invaders (scene, width, rows, bricks_in_row) {

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

  this.defenser;

}

Invaders.prototype.init = function () {

  this.initInvaders();
  this.initDefenser();
  this.initBullet();

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

Invaders.prototype.initDefenser = function () {

  var self = this;

  var geometry = new THREE.BoxGeometry(self.size * 2, self.size / 2, 5);
  self.defenser = new THREE.Mesh(geometry, self.material);
  self.defenser.position.y = -220;

  // ugly?
  $('body')
    .keydown(function (e) {
      switch (e.keyCode) {
        case 37:
          self.defenser.direction = 'left';
          break;
        case 39:
          self.defenser.direction = 'right';
          break;
      }
    })
    .keyup(function (e) {
      switch (e.keyCode) {
        case 37:
        case 39:
          self.defenser.direction = '';
      }
    });

};

Invaders.prototype.initBullet = function () {

  var self = this;
  self.bullet;

  $('body').keydown(function (e) {
    if (e.keyCode !== 32) return;

    self.throwBullet();
  });

};

Invaders.prototype.throwBullet = function () {

  var self = this;

  if (self.bullet) return;

  var geometry = new THREE.BoxGeometry(self.size / 4, self.size / 2, 5);
  self.bullet = new THREE.Mesh(geometry, self.material);
  self.bullet.position.y = -220;
  self.bullet.position.x = self.defenser.position.x;

  self.scene.add(self.bullet);

};

Invaders.prototype.draw = function () {

  this.group.position.x -= 200;
  this.group.position.y += 200;

  this.scene.add(this.group);
  this.scene.add(this.defenser);

};

Invaders.prototype.animate = function () {

  this.animateInvaders();
  this.animateDefenser();
  this.animateBulletAndCollide();

};

Invaders.prototype.animateDefenser = function () {

  var defenser = this.defenser;

  if (defenser.direction === 'left' && defenser.position.x > -200) {
    defenser.position.x -= 3;
  } else if (defenser.direction === 'right' && defenser.position.x < 200) {
    defenser.position.x += 3;
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

Invaders.prototype.animateBulletAndCollide = function () {

  var self = this;

  if (! self.bullet) return

  self.bullet.position.y += 5;

  // master of all, collisiomaster
  //
  var originPoint = self.bullet.position.clone();

  for (var vertexIndex = 0; vertexIndex < self.bullet.geometry.vertices.length; vertexIndex++) {

    var localVertex = self.bullet.geometry.vertices[vertexIndex].clone();
    var globalVertex = localVertex.applyMatrix4(self.bullet.matrix);
    var directionVector = globalVertex.sub(self.bullet.position);

    var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
    var collisionResults = ray.intersectObjects(self.all);

    if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
      var mesh = collisionResults[0].object;

      // TODO: rewrite?
      self.all = self.all.filter(function (invader) {
        return invader.id !== mesh.id;
      });

      // remove invader
      mesh.visible = false;
      self.scene.remove(mesh);

      // remove bullet
      self.bullet.visible = false;
      self.scene.remove(self.bullet);
      self.bullet = null;

      break;

    }

  }

};
