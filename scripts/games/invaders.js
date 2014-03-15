function Invaders (width, rows, bricks_in_row) {

  this.width = width; // canvas width;

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
  this.all = new THREE.Object3D();
  this.group = new THREE.Object3D();

  this.defenser;

}

Invaders.prototype.init = function () {

  this.initInvaders();
  this.initDefenser();
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

      this.all.add(mesh);
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

};

Invaders.prototype.draw = function (scene, camera) {
  this.group.position.x -= 200;
  this.group.position.y += 200;

  scene.add(this.group);
  scene.add(this.defenser);

  renderer.render(scene, camera);
};

Invaders.prototype.animate = function () {
  var rows = this.group.children;
  
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];

    if (row.move === this.gap * 2) {
      row.move = 0;
      row.direction = (row.direction === 'left') ? 'right' : 'left';
    }

    row.position.x += row.direction === 'left' ? 1 : -1;
    row.position.y -= .3;

    row.move += 1;
    
  }

};
