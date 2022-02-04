
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

  addBullet(time) {
    // si le temps écoulé depuis le dernier tir est > temps max alors on tire
    var tempEcoule = 0;

    if (this.lastBulletTime !== undefined) {
      tempEcoule = time - this.lastBulletTime;
    }

    if ((this.lastBulletTime === undefined) || (tempEcoule > this.delayMinBetweenBullets)) {
      bullets.push(new Bullet(this, 1, 5, this.charsAI));
      bulletFiredSound.play();
      // on mémorise le dernier temps.
      this.lastBulletTime = time;
    }
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
