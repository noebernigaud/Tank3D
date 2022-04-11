class ObjectPos extends BABYLON.Mesh {

  /** @type {number} */
  speedAngle;
  /** @type {number} */
  speedNorme;
  /** @type {BABYLON.Mesh} */
  shape;
  /** @type {number} */
  life;


  static counter = 0;

  /**
   * @param {ObjectEnum} type 
   * @param {number} posX 
   * @param {number} posY 
   * @param {number} posZ 
   * @param {number} speedNorme 
   * @param {number} speedAngle 
   */
  constructor(type, posX, posY, posZ, speedNorme, speedAngle, life = 1) {
    super('')

    var meshBabylon = true;
    let shape;
    this.type = type;
    this.life = life;

    switch (type.name) {
      case ObjectEnum.Barrel.name: { shape = ObjectEnum.Barrel.container.clone(); break; }
      case ObjectEnum.Bonus.name: { shape = ObjectEnum.Bonus.container.clone(); break; }
      case ObjectEnum.Player.name: { shape = ObjectEnum.Player.container.clone(); break; }
      case ObjectEnum.CharRed.name: { shape = ObjectEnum.CharRed.container.clone(); break; }
      case ObjectEnum.CharBlue.name: { shape = ObjectEnum.CharBlue.container.clone(); break; }
      case ObjectEnum.CharGreen.name: { shape = ObjectEnum.CharGreen.container.clone(); break; }
      case ObjectEnum.Rock.name: { shape = ObjectEnum.Rock.container.clone(); break; }
      case ObjectEnum.PalmTree1.name: { shape = ObjectEnum.PalmTree1.container.clone(); break; }
      case ObjectEnum.PalmTree2.name: { shape = ObjectEnum.PalmTree2.container.clone(); break; }
      case ObjectEnum.PalmTree3.name: { shape = ObjectEnum.PalmTree3.container.clone(); break; }
      case ObjectEnum.Cactus1.name: { shape = ObjectEnum.Cactus1.container.clone(); break; }
      case ObjectEnum.Cactus2.name: { shape = ObjectEnum.Cactus2.container.clone(); break; }
      case ObjectEnum.Cactus3.name: { shape = ObjectEnum.Cactus3.container.clone(); break; }
      case ObjectEnum.DesertRock.name: { shape = ObjectEnum.DesertRock.container.clone(); break; }
      case ObjectEnum.Tumbleweed.name: { shape = ObjectEnum.Tumbleweed.container.clone(); break; }
      case ObjectEnum.SnowyTree.name: { shape = ObjectEnum.SnowyTree.container.clone(); break; }
      case ObjectEnum.SnowyRock.name: { shape = ObjectEnum.SnowyRock.container.clone(); break; }
      case ObjectEnum.SnowyFence.name: { shape = ObjectEnum.Cactus2.SnowyFence.clone(); break; }
      case ObjectEnum.SnowyHut.name: { shape = ObjectEnum.SnowyHut.container.clone(); break; }
      default: meshBabylon = false;
    }

    /** @type {BABYLON.Mesh} */

    if (meshBabylon) {

      // shape.visibility = 1;
      shape.isVisible = true;
      // shape.showBoundingBox = true;

      shape.getChildMeshes().forEach(e => {
        e.visibility = true
        e.isVisible = true
        e.checkCollisions = true;
      });

      // TODO RENAME OBJECT.PLAYER in this.type
      this.position = new BABYLON.Vector3(posX, ObjectEnum.Player.height / 2 + 1, posZ);
      shape.position = this.position;

      this.shape = shape;
    }
    else {
      shape = this.createShape()
      this.addChild(shape)
      this.defineBoundingBox()
      this.position = new BABYLON.Vector3(posX, posY, posZ);
      // shape.position = this.position;
      this.shape = shape;
      // this.shape.position = this.position;
    }
    shadowGenerator.addShadowCaster(shape)
    shadowGenerator.getShadowMap().renderList.push(shape)

    // if (this.type.name == ObjectEnum.CharRed.name)
    //   //console.log(this.position);
    //   this.showBoundingBox = true;
    this.speedNorme = speedNorme;
    this.speedAngle = speedAngle;

    this.checkCollisions = true;
    //this.center_camera()
  }

  updateAngle(degree) {
    let new_angle = camera.rotation.y;
    // if (collision(this)) return;
    camera.rotation.y += degree;
    this.rotation.y = camera.rotation.y
    // char1.rotationQuaternion = new BABYLON.Vector3(0, 10, 0)
    this.speedAngle = new_angle;
  }

  // center_camera() {
  //   if (this === char1) {
  //     if (typeof tankContainer !== 'undefined') {
  //       //camera.alpha += tanksMeshes[3].rotation.z
  //       // camera.position.x = tankContainer.position.x - 100 * Math.sin(camera.rotation.y);
  //       // camera.position.y = tankContainer.position.y + 100;
  //       // camera.position.z = tankContainer.position.z - 120 * Math.cos(camera.rotation.y);
  //       //camera.rotation.y = tanksMeshes[3].rotation.y + 20
  //     }

  //   }
  // }

  move() {
    return;
    //deplace le tank
    // let has_moved = true;
    // /** @type {BABYLON.Vector3} */
    // let old_pos = this.position.clone()
    // this.position = this.position.add(new BABYLON.Vector3(this.speedNorme * Math.sin(this.speedAngle), 0, this.speedNorme * Math.cos(this.speedAngle)));
    // if (collision(this)) {
    //   this.position = old_pos.subtract(new BABYLON.Vector3(this.speedNorme * Math.sin(this.speedAngle), 0, this.speedNorme * Math.cos(this.speedAngle)));
    //   has_moved = false;
    // }
    // if (this === char1)
    //   this.center_camera()
    // return has_moved
  }

  modifySpeedAngle(angle) {

  }

  defineBoundingBox() {
    let childMeshes = this.getChildMeshes();
    let min = childMeshes[0].getBoundingInfo().boundingBox.minimumWorld;
    let max = childMeshes[0].getBoundingInfo().boundingBox.maximumWorld;
    for (let i = 0; i < childMeshes.length; i++) {
      let meshMin = childMeshes[i].getBoundingInfo().boundingBox.minimumWorld;
      let meshMax = childMeshes[i].getBoundingInfo().boundingBox.maximumWorld;

      min = BABYLON.Vector3.Minimize(min, meshMin);
      max = BABYLON.Vector3.Maximize(max, meshMax);
    }
    let newBoundingBox = new BABYLON.BoundingInfo(min, max)
    this.setBoundingInfo(newBoundingBox);
  }


  addChild(child) {
    child.parent = this;
    child.setParent(this)
    super.addChild(child)
    child.rotation = this.rotation
  }

  dispose(forceDispose) {
    this.life--
    if (forceDispose || this.life <= 0) {

      switch (this.type.name) {
        case ObjectEnum.Barrel.name: { remove(barrels, this); break; }
        case ObjectEnum.Bullet.name: { remove(bullets, this); break; }
        case ObjectEnum.Bonus.name: { remove(bonuses, this); break; }
        case ObjectEnum.Wall.name:
        case ObjectEnum.WallD.name: { remove(walls, this); break; }
        case ObjectEnum.CharRed.name: { this.moveSound.pause(); break; }
        case ObjectEnum.CharBlue.name: { this.moveSound.pause(); break; }
        case ObjectEnum.CharGreen.name: { this.moveSound.pause(); remove(charsAI, this); }
        case ObjectEnum.Player.name: { this.moveSound.pause(); remove(impostorCharList, this.physicsImpostor); remove(chars, this); break; }
        case ObjectEnum.Rock.name:
        case ObjectEnum.SnowyRock.name:
        case ObjectEnum.DesertRock.name: { remove(rocks, this); break }
        case ObjectEnum.PalmTree1.name:
        case ObjectEnum.PalmTree2.name:
        case ObjectEnum.PalmTree3.name:
        case ObjectEnum.Cactus1.name:
        case ObjectEnum.Cactus2.name:
        case ObjectEnum.Cactus3.name:
        case ObjectEnum.Tumbleweed.name:
        case ObjectEnum.SnowyTree.name: { remove(trees, this); break }
        case ObjectEnum.SnowyFence.name:
        case ObjectEnum.SnowyHut.name: { remove(others, this); break; }
        default:
          console.log(this.type.name, this);
          throw `Unknown object type (ObjectPos.dispose)`;
      }
      if (this.physicsImpostor) this.physicsImpostor.dispose()
      this.shape.dispose();
    }
  }


}