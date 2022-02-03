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
    let child = this.create_3d_shape(type.name)
    this.addChild(child)
    this.defineBoundingBox()
    this.showBoundingBox = true;
    this.speedNorme = speedNorme;
    this.speedAngle = speedAngle;

    this.position.x = posX
    this.position.y = posY
    this.position.z = posZ
    this.center_camera()
  }

  updateAngle(degree) {
    let new_angle = camera.rotation.y;
    // if (collision(this)) return;
    camera.rotation.y += degree;
    this.rotation.y = new_angle + degree - Math.PI * 3 / 2
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
    var shape;
    // if (obj instanceof Char)
    switch (img_path) {
      case ObjectEnum.Char.name:
        shape = this.createShape()
        break;
      case ObjectEnum.Mine.name:
        shape = BABYLON.MeshBuilder.CreateCylinder("mine",
          { diameter: obj.sizex, height: 3 }, scene);
        break;
      case ObjectEnum.Hole.name:
        shape = BABYLON.MeshBuilder.CreateCylinder("hole",
          { diameter: Hole.diameter, height: 0 }, scene);
        break;
      case ObjectEnum.Bullet.name:
        shape = BABYLON.MeshBuilder.CreateSphere("bullet",
          { diameter: Bullet.diameter }, scene);
        break;
      default:
        shape = BABYLON.MeshBuilder.CreateBox("box",
          { height: Wall.height, width: Wall.width, depth: Wall.depth }, scene);
        break;
    }
    if (img_path != ObjectEnum.Char.name)
      shape.material = createMaterial(scene, img_path);
    console.log(shape);
    return shape
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