
class Char extends ObjectPos {
  /** @type {BABYLON.Mesh} */
  shape;
  static width = cell_size - 5;
  static height = cell_size - 5;
  static depth = cell_size - 5;

  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} angle 
   * @param {number} vitesse 
   * @param {number} tempsMinEntreTirsEnMillisecondes 
   * @param {HTMLImageElement} img 
   */
  constructor(type, x, y, angle, vitesse, tempsMinEntreTirsEnMillisecondes) {
    super(type, -width / 2 + x, Char.height / 2 + 2, - height / 2 + y, vitesse, angle);
    this.delayMinBetweenBullets = tempsMinEntreTirsEnMillisecondes;
    this.delayMinBetweenMines = 5000;
    this.intelligence = new Intelligence(this);

    this.physicsImpostor = new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 7000, restitution: 0, friction: 5 });
  }

  moveForeward(coeff) {
    this.move(Math.cos(camera.rotation.y - Math.PI / 2) * coeff, Math.sin(camera.rotation.y - Math.PI / 2) * coeff);
  }

  moveBackward(coeff) {
    this.move(-Math.cos(camera.rotation.y - Math.PI / 2) * coeff, -Math.sin(camera.rotation.y - Math.PI / 2) * coeff);
  }

  //FONCTIONS UTILITAIRES DE VERIFICATION DES COLLISIONS AVEC AUTRES OBJETS DANS LES DIFFERENTES DIRECTIONS

  collObjL() {
    if (walls.every(wall => !collL(this.x, this.y, this.sizex, this.sizey, wall.x, wall.y, wall.sizex, wall.sizey))) {
      if (holes.every(hole => !collL(this.x, this.y, this.sizex, this.sizey, hole.x, hole.y, hole.sizex, hole.sizey))) {
        if (chars.every(char => !collL(this.x, this.y, this.sizex, this.sizey, char.x, char.y, char.sizex, char.sizey))) {
          return false;
        }
      }
    }
    return true;
  }

  collObjR() {
    if (walls.every(wall => !collR(this.x, this.y, this.sizex, this.sizey, wall.x, wall.y, wall.sizex, wall.sizey))) {
      if (holes.every(hole => !collR(this.x, this.y, this.sizex, this.sizey, hole.x, hole.y, hole.sizex, hole.sizey))) {
        if (chars.every(char => !collR(this.x, this.y, this.sizex, this.sizey, char.x, char.y, char.sizex, char.sizey))) {
          return false;
        }
      }
    }
    return true;
  }

  collObjT() {
    if (walls.every(wall => !collT(this.x, this.y, this.sizex, this.sizey, wall.x, wall.y, wall.sizex, wall.sizey))) {
      if (holes.every(hole => !collT(this.x, this.y, this.sizex, this.sizey, hole.x, hole.y, hole.sizex, hole.sizey))) {
        if (chars.every(char => !collT(this.x, this.y, this.sizex, this.sizey, char.x, char.y, char.sizex, char.sizey))) {
          return false;
        }
      }
    }
    return true;
  }

  collObjB() {
    if (walls.every(wall => !collB(this.x, this.y, this.sizex, this.sizey, wall.x, wall.y, wall.sizex, wall.sizey))) {
      if (holes.every(hole => !collB(this.x, this.y, this.sizex, this.sizey, hole.x, hole.y, hole.sizex, hole.sizey))) {
        if (chars.every(char => !collB(this.x, this.y, this.sizex, this.sizey, char.x, char.y, char.sizex, char.sizey))) {
          return false;
        }
      }
    }
    return true;
  }

  //DEPLACEMENT DU CHAR DANS UNE DIRECTION SI IL N'Y A PAS COLLISION

  moveL(coeff) {
    if (!this.collObjL()) { this.move(-coeff, 0); }
  }

  moveR(coeff) {
    if (!this.collObjR()) { this.move(coeff, 0); }
  }

  moveT(coeff) {
    if (!this.collObjT()) { this.move(0, -coeff); }
  }

  moveB(coeff) {
    if (!this.collObjB()) { this.move(0, coeff); }
  }

  move() {
    return
    //deplace le tank
    let has_moved = true;
    /** @type {BABYLON.Vector3} */
    let old_pos = this.position.clone()
    this.position = this.position.add(new BABYLON.Vector3(this.speedNorme * Math.sin(this.speedAngle), 0, this.speedNorme * Math.cos(this.speedAngle)));
    if (collision(this)) {
      this.position = old_pos.subtract(new BABYLON.Vector3(this.speedNorme * Math.sin(this.speedAngle), 0, this.speedNorme * Math.cos(this.speedAngle)));
      has_moved = false;
    }
    if (this === char1)
      this.center_camera()
    return has_moved
  }

  addBullet(time) {
    // si le temps écoulé depuis le dernier tir est > temps max alors on tire
    var tempEcoule = 0;

    if (this.lastBulletTime !== undefined) {
      tempEcoule = time - this.lastBulletTime;
    }

    if ((this.lastBulletTime === undefined) || (tempEcoule > this.delayMinBetweenBullets)) {
      let startposx = this.x - (this.sizex + 5) * Math.cos(this.angle);
      let startposy = this.y - (this.sizex + 5) * Math.sin(this.angle);
      if (walls.every(wall => !this.isInto(startposx, startposy, wall.x, wall.y, wall.sizex, wall.sizey))) {
        bullets.push(new Bullet(this, 1, 5, this.charsAI));
        bulletFiredSound.play();
        // on mémorise le dernier temps.
        this.lastBulletTime = time;
      }
    }
  }

  isInto(startposx, startposy, wallx, wally, sx, sy) {
    return ((startposx > wallx) && (startposx < wallx + sx) && (startposy > wally) && (startposy < wally + sy))
  }

  addMine(time) {
    var tempEcouleMine = 0;

    if (this.lastMineTime !== undefined) {
      tempEcouleMine = time - this.lastMineTime;
    }

    if ((this.lastMineTime === undefined) || (tempEcouleMine > this.delayMinBetweenMines)) {
      minePlacedSound.play();
      mines.push(new Mine(this));
      // on mémorise le dernier temps.
      this.lastMineTime = time;
    }
  }

  removeChar() {
    let position = chars.indexOf(this);
    this.shape.dispose();
    chars.splice(position, 1);
    explosionSound.play();
    if (this === char1) {
      stopgame();
    }
    else {
      position = charsAI.indexOf(this);
      charsAI.splice(position, 1);
    }
  }

  createShape() {
    if (true) {
      var shape = BABYLON.MeshBuilder.CreateBox("char",
        { height: Char.height, depth: Char.depth, width: Char.width }, scene);
      shape.material = createMaterial(scene, "images/tank.png");
      return shape;
    } else {
      // // model = await BABYLON.SceneLoader.ImportMeshAsync("", "./models/", "tank.babylon").then((meshes) => {
      //   // for (var i = 0; i < meshes.length; i++) {
      //   //   meshes[i].scaling = new BABYLON.Vector3(0.32, 0.32, 0.32);
      //   //   // meshes[i].rotation = v
      //   // }
      //   console.log('hereeeee');
      //   console.log(this.scene.getMeshByName('german_panzer_ww2_ausf_b.Turret_2'));
      //   x = meshes[0]

      //   console.log(x.rotation);
      //   console.log('this is x in call', x);
      //   x.position.x = 100
      // });
      // console.log('this is x', x);
    }
  }
}
