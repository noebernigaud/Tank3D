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

    this.moveSound = new Audio('audio/electricFerry.wav');
    this.moveSound.volume = 0.4
    this.moveSound.loop = true
    this.moveSound.autoplay = true
    this.bulletFiredSound = new Audio('audio/TankFire.wav');
    this.setVolumeEmittedFireBullet = 0.3
    this.bulletFiredSound.volume = this.setVolumeEmittedFireBullet;

  }

  moveForeward(coeff) {
    this.move(Math.cos(camera.rotation.y - Math.PI / 2) * coeff, Math.sin(camera.rotation.y - Math.PI / 2) * coeff);
  }

  moveBackward(coeff) {
    this.move(-Math.cos(camera.rotation.y - Math.PI / 2) * coeff, -Math.sin(camera.rotation.y - Math.PI / 2) * coeff);
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

  removeChar() {
    let position = chars.indexOf(this);
    this.shape.dispose();
    chars.splice(position, 1);
    explosionSound.play();
    if (this === char1) {
      stopgame();
    } else {
      position = charsAI.indexOf(this);
      charsAI.splice(position, 1);
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
    if (scene.menu.isInMenu()) return
    if (this.life <= 0) return;
    var turret = this.getTurretTank()
    var quaternion = turret.rotationQuaternion.toEulerAngles().x
    if (quaternion > -0.12 && isUp) {
      turret.rotate(BABYLON.Axis.X, this.inclinaisonTurretIncrement * (isUp ? -angle : angle))
      // console.log("turret trying to go UP");
    }
    if (quaternion < 0.04 && !isUp) {
      turret.rotate(BABYLON.Axis.X, this.inclinaisonTurretIncrement * (isUp ? -angle : angle))
      // console.log("turret trying to go DOWN");
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

    if (this.life <= 0) return
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
    return this.shape.getChildMeshes()[0];
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  applyStrategy() {
    this.strategy.applyStrategy()
  }

  movingSmoke(isMoving) {
    this.exhaustPipeLeft.updateSpeed = isMoving ? 0.1 : 0.005;
    this.exhaustPipeRight.updateSpeed = isMoving ? 0.1 : 0.005;
    this.exhaustPipeLeft.maxLifeTime = isMoving ? 0.4 : 0.2;
    this.exhaustPipeRight.maxLifeTime = isMoving ? 0.4 : 0.2;

    this.exhaustPipeLeft.maxSize = isMoving ? 0.5 : 0.2;
    this.exhaustPipeRight.maxSize = isMoving ? 0.5 : 0.2;
    this.exhaustPipeLeft.emitRate = isMoving ? 500 : 300;
    this.exhaustPipeRight.emitRate = isMoving ? 500 : 300;
    this.exhaustPipeLeft.gravity = new BABYLON.Vector3(0.25, isMoving ? 3 : 8, 0);
    this.exhaustPipeRight.gravity = new BABYLON.Vector3(0.25, isMoving ? 3 : 8, 0);
  }


  healthLoss(damage) {
    if (damage < this.health) this.health -= damage
    else {
      this.health = 0
      this.dispose(false)
    }
  }

  setCrossHairPosition() {
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
        highlightTank(char.shape, true)

      } else {
        if (hl) hl.removeAllMeshes()
      }
      this.crossHair.position = position
    }
    else {
      ShootAI.targetPlayer(char1, 1000, true, laserCoolDown, true, this.crossHair);

      this.crossHair.position.y -= 200
      if (hl) hl.removeAllMeshes()
    }
  }



}

function highlightTank(tank, toHighlight) {
  if (toHighlight && !hl.hasMesh(tank.getChildMeshes()[0])) {
    tank.getChildMeshes().forEach(m => hl.addMesh(m, new BABYLON.Color3(1, 0, 0)))
  }
}

/** @param {Char} obj */
function loadCrossHair(obj, scene) {
  var crossHair = new BABYLON.MeshBuilder.CreatePlane("crossHair", { size: 0.5 }, scene);

  // crossHair.parent = char1.getTurretTank()
  let position = ShootAI.targetPlayer(obj, 1000, false, 100000, true, crossHair);
  // crossHair.parent = obj.shape
  crossHair.position = position
  console.log(position);
  crossHair.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_Y;

  crossHair.material = new BABYLON.StandardMaterial("crossHair", scene);
  crossHair.material.diffuseTexture = new BABYLON.Texture("images/gunaims.png", scene);
  crossHair.material.diffuseTexture.hasAlpha = true;
  crossHair.material.emissiveColor = BABYLON.Color3.White()
  crossHair.isPickable = false;
  obj.crossHair = crossHair;
}