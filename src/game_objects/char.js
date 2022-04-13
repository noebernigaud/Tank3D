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
  constructor(type, x, y, angle, vitesse, tempsMinEntreTirsEnMillisecondes, bulletSpeed = 40, bulletLife = 2, life = 1, health = 10, bulletDamage = 5, inclinaisonTurretIncrement = 0.002) {
    super(type, -width / 2 + x, Char.height / 2, -height / 2 + y, vitesse, angle, life);

    this.getTurretTank().rotate(BABYLON.Axis.X, -0.01)
    this.getTurretTank().rotate(BABYLON.Axis.X, +0.01)
    this.crossHair = undefined

    if (type.name == ObjectEnum.Player.name) {
      let camera1 = new BABYLON.FollowCamera("tankCamera", this.getTurretTank().position, scene, this.getTurretTank());
      camera1.radius = 5 //3;
      camera1.heightOffset = 2//0;
      camera1.rotationOffset = 180 //-98;
      camera1.cameraAcceleration = .1;
      camera1.maxCameraSpeed = 10;
      camera.dispose();
      camera = camera1;
      loadCrossHair(this, scene)
      // engine.runRenderLoop(() => scene.render())
    } else {
      this.shape.rotate(BABYLON.Axis.Y, 3.14 / 2);
      MoveAI.rotateTurret(this)
    }

    this.delayMinBetweenBullets = tempsMinEntreTirsEnMillisecondes;
    this.delayMinBetweenMines = 5000;
    this.bulletSpeed = bulletSpeed;
    this.bulletLife = bulletLife;
    this.bulletDamage = bulletDamage;
    this.inclinaisonTurretIncrement = inclinaisonTurretIncrement;
    this.health = health
    this.maxHealth = health

    this.physicsImpostor = new BABYLON.PhysicsImpostor(this.shape, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 300000, restitution: 0.2, friction: (type.name == ObjectEnum.Player.name) ? 0.2 : 0.2 })
    impostorCharList.push(this.physicsImpostor)
    this.exhaustPipeLeft = createSmoke(this.shape, false, true)
    this.exhaustPipeRight = createSmoke(this.shape, true, true)
    this.dust = createDust(this.shape);
    this.healtBar = new Healthbar(this);

    this.moveSound = new Audio('audio/electricFerry.mp3');
    this.moveSound.volume = 0.4
    this.moveSound.loop = true
    this.moveSound.autoplay = true

    this.bulletFiredSound = new Audio('audio/TankFire.mp3');
    this.setVolumeEmittedFireBullet = 0.3
    this.bulletFiredSound.volume = this.setVolumeEmittedFireBullet;

    this.charExploseSound = new Audio('audio/charExplosion.mp3');
    this.charExploseSound.volume = 0.4
  }

  addBullet(time = Date.now()) {
    if (this.life <= 0) return;
    // si le temps écoulé depuis le dernier tir est > temps max alors on tire
    var tempEcoule = 0;

    if (this.lastBulletTime !== undefined) {
      tempEcoule = time - this.lastBulletTime;
    }

    if ((this.lastBulletTime === undefined) || (tempEcoule > this.delayMinBetweenBullets)) {

      //création d'une nouvelle balle
      var bullet = new Bullet(this)

      this.bulletFiredSound.volume = this.setVolumeEmittedFireBullet
      playSoundWithDistanceEffect(this.bulletFiredSound, this.shape)

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

  rotateAxisY(angle) {
    if (this.life <= 0) return
    this.shape.rotate(BABYLON.Axis.Y, angle)
    this.rotateTurretAxisY(-angle)
  }

  rotateTurretAxisY(angle) {
    if (this.life <= 0) return
    var turret = this.getTurretTank()
    var prevAngle = turret.rotationQuaternion.toEulerAngles().x;
    turret.rotate(BABYLON.Axis.X, -prevAngle)
    turret.rotate(BABYLON.Axis.Y, angle)
    turret.rotate(BABYLON.Axis.X, prevAngle)
  }

  rotateTurretUpDown(isUp, angle = 1) {
    if (this.life <= 0) return;
    var turret = this.getTurretTank()
    if (turret.rotationQuaternion.toEulerAngles().x > -0.12 && isUp) {
      turret.rotate(BABYLON.Axis.X, this.inclinaisonTurretIncrement * (isUp ? -angle : angle))
    }
    if (turret.rotationQuaternion.toEulerAngles().x < 0.04 && !isUp) {
      turret.rotate(BABYLON.Axis.X, this.inclinaisonTurretIncrement * (isUp ? -angle : angle))
    }
  }


  moveTankForeward() {
    this.moveTank(this.speedNorme)
  }

  moveTankBackward() {
    var speed = -12
    this.moveTank(speed)
  }

  moveTank(speed) {

    if (this.isRenversed() || this.life <= 0) return
    if (this.physicsImpostor.friction != 0) {
      this.stabilizeTank(false)
    }
    this.movingSmoke(true)
    this.dust.start();
    this.physicsImpostor.setAngularVelocity(
      new BABYLON.Vector3(0, 0, 0))

    //BEGIN: CODE TO ADJUST THE VELOCITY TO OUR NEW DIRECTION

    //we register the linear velocity and apply an opposing force to stop it
    let prevVel = this.physicsImpostor.getLinearVelocity()

    this.physicsImpostor.applyForce(new BABYLON.Vector3(-prevVel.x * 300000,
      0, -prevVel.z * 300000
    ), this.shape.position)

    //we register the coeff between the previous linear velocity and its normalized vector to quatify its power
    let normPreVel = prevVel.normalizeToNew();
    let coeff = prevVel.x / normPreVel.x

    //normalized vector of our current direction
    let normalizedDir = this.shape.getDirection(BABYLON.Axis.Z).normalizeToNew()

    //we give back the force for previous velocity in the right direction using the current
    //direction's normalized vector and multiplying it by the previous velocity's power
    this.physicsImpostor.applyForce(new BABYLON.Vector3(
      coeff * 260000 * normalizedDir.x,
      0,
      coeff * 260000 * normalizedDir.z
    ), this.shape.position)

    //END

    //add new force when asking the tank to move
    let frontVec = this.shape.getDirection(BABYLON.Axis.Z)
    let moveVec = frontVec.scale(speed * 80000)
    let realVec = new BABYLON.Vector3(moveVec.x, this.physicsImpostor.getLinearVelocity().y, moveVec.z)
    this.physicsImpostor.applyForce(realVec, this.shape.position)
  }

  stabilizeTank(hasFriction = true) {
    remove(impostorCharList, this.physicsImpostor)
    this.physicsImpostor.dispose()
    this.physicsImpostor = new BABYLON.PhysicsImpostor(this.shape, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 30000, restitution: 0.2, friction: hasFriction ? 0.5 : 0 });
    impostorCharList.push(this.physicsImpostor)
    this.movingSmoke(false)
    this.dust.stop();
  }

  destroyTank() {
    // explode(this.shape)
    this.stabilizeTank()
    this.healtBar.disposeBar()
    this.moveSound.pause();
    charsDestroyed.push(this)
    var smok = createSmoke(this.shape, false, false, true)
    playSmoke(smok)
    createFire(this.shape);
    playSoundWithDistanceEffect(this.charExploseSound, this, false)
    // ObjectEnum.Player.meshes.forEach(e => e.setParent(null))
    // ObjectEnum.Player.meshes.forEach(e => e.physicsImpostor = new BABYLON.PhysicsImpostor(e, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }));
    //console.log("Disposing");
    //this.shape.dispose()
  }


  getTurretTank() {
    return this.shape.getChildMeshes()[0];
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  applyStrategy() {
    this.strategy.applyStrategy()
  }

  movingSmoke(isMoving) {
    this.exhaustPipeLeft.updateSpeed = isMoving ? 0.01 : 0.005;
    this.exhaustPipeRight.updateSpeed = isMoving ? 0.01 : 0.005;
    this.exhaustPipeLeft.maxLifeTime = isMoving ? 0.4 : 0.2;
    this.exhaustPipeRight.maxLifeTime = isMoving ? 0.4 : 0.2;

    // this.exhaustPipeLeft.maxSize = isMoving ? 0.5 : 0.2;
    // this.exhaustPipeRight.maxSize = isMoving ? 0.5 : 0.2;
    this.exhaustPipeLeft.removeSizeGradient(0);
    this.exhaustPipeLeft.removeSizeGradient(1);
    this.exhaustPipeRight.removeSizeGradient(0);
    this.exhaustPipeRight.removeSizeGradient(1);
    this.exhaustPipeLeft.addSizeGradient(0, isMoving ? 0.05 : 0.03);
    this.exhaustPipeLeft.addSizeGradient(1, isMoving ? 0.3 : 0.2);
    this.exhaustPipeRight.addSizeGradient(0, isMoving ? 0.05 : 0.03);
    this.exhaustPipeRight.addSizeGradient(1, isMoving ? 0.3 : 0.2);
    this.exhaustPipeLeft.emitRate = isMoving ? 400 : 200;
    this.exhaustPipeRight.emitRate = isMoving ? 400 : 200;
    this.exhaustPipeLeft.gravity = new BABYLON.Vector3(0.25, isMoving ? 3 : 8, 0);
    this.exhaustPipeRight.gravity = new BABYLON.Vector3(0.25, isMoving ? 3 : 8, 0);
  }


  healthLoss(damage) {
    if (damage < this.health) this.health -= damage
    else {
      this.health = 0
      this.life--
      // this.dispose(false)
    }
  }

  setCrossHairPosition() {
    if (!this.crossHair) return
    let laserCoolDown = 1;
    let laserRes = ShootAI.targetPlayer(char1, 1000, false, laserCoolDown, true, this.crossHair);
    if (laserRes) {
      let [position, hitMesh] = laserRes
      let cannonPoint = getCannonPoint(this)

      let distanceFromTank = Math.sqrt((position.x - cannonPoint.x) ** 2 + (position.y - cannonPoint.y) ** 2 + (position.z - cannonPoint.z) ** 2) * 4
      ShootAI.targetPlayer(char1, distanceFromTank, true, laserCoolDown, true, this.crossHair);
      // crossHair.parent = obj.shape
      let char;

      if (char = chars.find(e => e.shape == hitMesh)) {
        highlightTank(char, true)

      } else {
        if (hl) hl.removeAllMeshes()
      }
      if (this.crossHair.position) this.crossHair.position = position
    }
    else {
      ShootAI.targetPlayer(char1, 1000, true, laserCoolDown, true, this.crossHair);

      if (this.crossHair.position) this.crossHair.position.y -= 200
      if (hl) hl.removeAllMeshes()
    }
  }

  dispose(forceDispose) {
    super.dispose(forceDispose)
    this.healtBar.disposeBar()
    if (this.crossHair) this.crossHair.dispose()
  }

}

function lights() {
  var gui = new dat.GUI();
  gui.domElement.style.marginTop = "100px";
  gui.domElement.id = "datGUI";
  var options = {
    Emissive: 0.3,
    Specular: 0.3,
    Diffuse: 0.3,
    Ambient: 0.3
  }

  gui.add(options, "Emissive", 0, 1).onChange(function (value) {
    char1.shape.getChildMeshes().forEach(e => { if (e.material) e.material.emissiveColor = new BABYLON.Color3(value, value, value) })
  });
  gui.add(options, "Diffuse", 0, 1).onChange(function (value) {
    char1.shape.getChildMeshes().forEach(e => { if (e.material) e.material.diffuseColor = new BABYLON.Color3(value, value, value) })
  });
  gui.add(options, "Specular", 0, 1).onChange(function (value) {
    char1.shape.getChildMeshes().forEach(e => { if (e.material) e.material.specularColor = new BABYLON.Color3(value, value, value) })
  });
  gui.add(options, "Ambient", 0, 1).onChange(function (value) {
    char1.shape.getChildMeshes().forEach(e => { if (e.material) e.material.ambientColor = new BABYLON.Color3(value, value, value) })
  });

  // myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
  // myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
  // myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
  // myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);



}
/**
 * 
 * @param {Char} tank 
 * @param {boolean} toHighlight 
 */
function highlightTank(tank, toHighlight) {
  if (toHighlight && !hl.hasMesh(tank.shape.getChildMeshes()[0])) {
    tank.shape.getChildMeshes().filter(m =>
      !((m == tank.healtBar.healthBarContainer) || (tank.healtBar.healthBarContainer.getChildMeshes().includes(m)))).forEach(m => hl.addMesh(m, new BABYLON.Color3(1, 0, 0)))
  }
}

/** @param {Char} obj */
function loadCrossHair(obj, scene) {
  var crossHair = new BABYLON.MeshBuilder.CreatePlane("crossHair", { size: 0.5 }, scene);

  crossHair.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_Y;

  crossHair.material = new BABYLON.StandardMaterial("crossHair", scene);
  crossHair.material.diffuseTexture = new BABYLON.Texture("images/gunaims.png", scene);
  crossHair.material.diffuseTexture.hasAlpha = true;
  crossHair.material.emissiveColor = BABYLON.Color3.White()
  crossHair.isPickable = false;
  obj.crossHair = crossHair;
}