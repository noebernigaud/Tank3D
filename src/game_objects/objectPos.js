class ObjectPos extends BABYLON.Mesh {

  /** @type {number} */
  speedAngle;
  /** @type {number} */
  speedNorme;
  /** @type {BABYLON.Mesh} */
  shape;

  static counter = 0;

  /**
   * @param {ObjectEnum} type 
   * @param {number} posX 
   * @param {number} posY 
   * @param {number} posZ 
   * @param {number} speedNorme 
   * @param {number} speedAngle 
   */
  constructor(type, posX, posY, posZ, speedNorme, speedAngle) {
    super('')


    let shape;
    this.type = type;
    /** @type {BABYLON.Mesh} */
    if (type.name == ObjectEnum.Player.name) {
      shape = ObjectEnum.Player.container.clone();
      shape.physicsImpostor = new BABYLON.PhysicsImpostor(shape, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 100, restitution: 0.2 })
      shape.visibility = 0.000001;
      shape.showBoundingBox = true;

      shape.getChildMeshes().forEach(e => {
        e.visibility = true
        e.checkCollisions = true;
      });

      // TODO RENAME OBJECT.PLAYER in this.type
      this.position = new BABYLON.Vector3(posX, ObjectEnum.Player.height / 2, posZ);
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

    if (this.type.name == ObjectEnum.CharRed.name)
      console.log(this.position);
    this.showBoundingBox = true;
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
}