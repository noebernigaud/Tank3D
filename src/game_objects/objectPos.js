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
    let child = this.createShape()
    this.addChild(child)
    this.defineBoundingBox()
    this.showBoundingBox = true;
    this.speedNorme = speedNorme;
    this.speedAngle = speedAngle;
    this.child = child

    this.position.x = posX
    this.position.y = posY;
    this.position.z = posZ
    this.center_camera()
    this.physicsImpostor = new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsImpostor.BoxImpostor, { mass: type.name === ObjectEnum.Wall.name ? 0 : 5, restitution: type.name === ObjectEnum.Wall.name ? 1 : 0 });
    // if (type.name == ObjectEnum.Player.name)
    //   scene.onPointerObservable.add((e) => {
    //     console.log("test1");
    //     if (e.type == BABYLON.PointerEventTypes.POINTERDOWN) {
    //       //this.position.copyFrom(e.pickInfo.ray.origin);
    //       this.physicsImpostor.setLinearVelocity(this.physicsImpostor.getLinearVelocity().add(new BABYLON.Vector3(1, 1, 1)));

    //     }
    //   })
  }

  updateAngle(degree) {
    let new_angle = camera.rotation.y;
    // if (collision(this)) return;
    camera.rotation.y += degree;
    this.rotation.y = camera.rotation.y
    this.speedAngle = new_angle;
  }

  center_camera() {
    if (this === char1) {
      camera.position.x = char1.position.x - 100 * Math.sin(camera.rotation.y);
      camera.position.y = char1.position.y + 100;
      camera.position.z = char1.position.z - 100 * Math.cos(camera.rotation.y);
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
    this.setBoundingInfo(new BABYLON.BoundingInfo(min, max));
  }
}