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
  this.bullets = new THREE.Object3D();

  this.players = new THREE.Object3D();

}

Invaders.prototype.init = function () {

  var self = this;

  self.initInvaders();

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

  var defenser = new THREE.Object3D;

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

  defenser.position.y = -220;

  self.players.add(defenser);

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
        break;
      case 'a:down':
      case 'b:down':
        if (! defenser.bullet)
          self.throwBullet(defenser);

    }

  });

};

Invaders.prototype.throwBullet = function (defenser) {

  var self = this;

  if (defenser.bullet) return;

  var geometry = new THREE.BoxGeometry(self.size / 4, self.size / 2, 5);
  var material = new THREE.MeshBasicMaterial({ color: 0xFECD5A });

  var bullet = new THREE.Mesh(geometry, material);

  bullet.position.y = -200;
  bullet.position.x = defenser.position.x;

  /// LOLOLOLOL
  defenser.bullet = bullet;
  bullet.defenser = defenser;

  self.scene.add(bullet);

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

  mesh.defenser.bullet = null;
  mesh.defenser = null;

};

Invaders.prototype.animateBullet = function () {

  var self = this;

  if (self.players.children.length !== 2) return;

  for (var i = 0; i < 2; i++) {

    var bullet = self.players.children[i].bullet;

    window.test = self.players.children[i];

    if (! bullet) continue;

    bullet.position.y += 5;

    if (bullet.position.y > 220) {
      self.destroyBullet(bullet);
      return;
    }
  }

};

Invaders.prototype.collideBullet = function () {

  var self = this;

  // master of all, collisionmaster

  console.log('shit');

  if (self.players.children.length !== 2) return;

  console.log('playerebi ar gvkavs');

  for (var i = 0; i < 2; i++) {

    var bullet = self.players.children[i].bullet;

    if (! bullet) continue;

    console.log('buletia buletis unaxavia');

    var originPoint = self.players.children[i].bullet.position.clone();

    for (var vertexIndex = 0; vertexIndex < bullet.geometry.vertices.length; vertexIndex++) {

      var localVertex = bullet.geometry.vertices[vertexIndex].clone();
      var globalVertex = localVertex.applyMatrix4(bullet.matrix);
      var directionVector = globalVertex.sub(bullet.position);

      var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
      var collisionResults = ray.intersectObjects(self.all);

      console.log('vamocmeb kolizias');

      if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {

        console.log('aris kolizia');

        var mesh = collisionResults[0].object;

        // remove invader
        self.destroyInvader(mesh);

        // remove bullet
        self.destroyBullet(bullet);

        break;
      }

    }

  }

};

Invaders.prototype.testWin = function () {

  var self = this;

  if (self.all.length === 0) {
    $('.doge.loose').show();
    $('#game-view').hide();
  }

};

Invaders.prototype.testLoose = function () {

  var self = this;

  for (var i = 0; i < self.group.children.length; i++) {
    var row = self.group.children[i];

    if (row.children.length === 0) continue;

    if (row.position.y <= -305) {
      $('.doge.win').show();
      $('#game-view').hide();
    }
  }

};

Invaders.prototype.stop = function () {

  var self = this;

  self.end = true;

};

