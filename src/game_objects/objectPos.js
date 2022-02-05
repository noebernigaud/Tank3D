class ObjectPos extends BABYLON.Mesh {

  /** @type {number} */
  speedAngle;
  /** @type {number} */
  speedNorme;
  /** @type {ObjectPos} */

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

    this.type = type;
    /** @type {BABYLON.Mesh} */
    this.shape = this.createShape()
    this.addChild(this.shape)

    this.defineBoundingBox()
    this.showBoundingBox = true;
    this.speedNorme = speedNorme;
    this.speedAngle = speedAngle;

    this.position = new BABYLON.Vector3(posX, posY, posZ);
    this.center_camera()
  }

  updateAngle(degree) {
    let new_angle = camera.rotation.y;
    // if (collision(this)) return;
    camera.rotation.y += degree;
    this.rotation.y = camera.rotation.y
    // char1.rotationQuaternion = new BABYLON.Vector3(0, 10, 0)
    this.speedAngle = new_angle;
  }

  center_camera() {
    if (this === char1) {
      if (typeof tankContainer !== 'undefined') {
        camera.target = tanksMeshes[3]
        //camera.alpha += tanksMeshes[3].rotation.z
        // camera.position.x = tankContainer.position.x - 100 * Math.sin(camera.rotation.y);
        // camera.position.y = tankContainer.position.y + 100;
        // camera.position.z = tankContainer.position.z - 120 * Math.cos(camera.rotation.y);
        //camera.rotation.y = tanksMeshes[3].rotation.y + 20
      }

    }
  }

  move() {
    return;
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

  modifySpeedAngle(angle) {

  }

  create_3d_shape(img_path) {
    /** @type {BABYLON.Mesh} */
    this.createShape();
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