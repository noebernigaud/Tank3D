
class Char extends ObjectPos {
  static width = cell_size;
  static height = cell_size;
  static depth = cell_size;

  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} angle 
   * @param {number} vitesse 
   * @param {number} tempsMinEntreTirsEnMillisecondes 
   * @param {HTMLImageElement} img 
   */
  constructor(type, x, y, angle, vitesse, tempsMinEntreTirsEnMillisecondes) {
    super(type, -width / 2 + x, Char.height / 2, - height / 2 + y, vitesse, angle);

    if (type.name == tankImage.src) {
      camera = new BABYLON.FollowCamera("tankCamera", this.shape.getChildMeshes()[1].position, scene, this.shape.getChildMeshes()[1]);
      camera.radius = 10;
      camera.heightOffset = 5;
      camera.rotationOffset = 180;
      camera.cameraAcceleration = .1;
      camera.maxCameraSpeed = 10;
      engine.runRenderLoop(() =>
        scene.render()
      )
    }

    this.delayMinBetweenBullets = tempsMinEntreTirsEnMillisecondes;
    this.delayMinBetweenMines = 5000;
    this.intelligence = new Intelligence(this);
    this.physicsImpostor = new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 30000, restitution: 0.5 })
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
      var bullet = new Bullet(this, 1, 80, this.charsAI)
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
      // model = await BABYLON.SceneLoader.ImportMeshAsync("", "./models/", "tank.babylon").then((meshes) => {
      //   for (var i = 0; i < meshes.length; i++) {
      //     meshes[i].scaling = new BABYLON.Vector3(0.32, 0.32, 0.32);
      //     // meshes[i].rotation = v
      //   }
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

  rotateAxisY(angle) {
    this.shape.rotate(BABYLON.Axis.Y, angle)
    this.rotateTurretAxisY(-angle)
  }

  rotateTurretAxisY(angle) {
    this.shape.getChildMeshes()[1].rotate(BABYLON.Axis.Y, angle)
  }

  moveTankForeward() {
    var speed = 2.5
    this.moveTank(speed)
  }

  moveTankBackward() {
    var speed = -1.25
    this.moveTank(speed)
  }

  moveTank(speed) {
    this.shape.physicsImpostor.setAngularVelocity(
      new BABYLON.Vector3(0, 0, 0))
    // this.shape.physicsImpostor.friction = 0
    // this.shape.physicsImpostor.dispose()
    // this.shape.physicsImpostor = new BABYLON.PhysicsImpostor(this.shape, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1000, restitution: 0.2, friction: 0 });
    let frontVec = this.shape.getDirection(BABYLON.Axis.Z)
    let moveVec = frontVec.scale(speed * 10000)
    let realVec = new BABYLON.Vector3(moveVec.x, this.shape.physicsImpostor.getLinearVelocity().y, moveVec.z)
    this.shape.physicsImpostor.applyForce(realVec, this.shape.position)
  }

  stabilizeTank(hasFriction = true) {
    console.log("Stabilize", hasFriction);
    // this.shape.physicsImpostor.friction = 0.2
    this.shape.physicsImpostor.dispose()
    this.shape.physicsImpostor = new BABYLON.PhysicsImpostor(this.shape, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 30000, restitution: 0.2, friction: hasFriction ? 0.5 : 0 });
  }

  destroyTank(isDisabled) {
    if (isDisabled) {
      // explode(this.shape)
      var smok = createSmoke(char1.shape)
      playSmoke(smok)
      createFire(char1.shape);
      // ObjectEnum.Player.meshes.forEach(e => e.setParent(null))
      // ObjectEnum.Player.meshes.forEach(e => e.physicsImpostor = new BABYLON.PhysicsImpostor(e, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }));
      //console.log("Disposing");
      //this.shape.dispose()
    }
  }

  getTurretTank() {
    return this.shape.getChildMeshes()[1];
  }
}
