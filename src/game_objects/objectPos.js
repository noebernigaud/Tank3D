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
    this.addChild(this.create_3d_shape(type.name))
    this.speedNorme = speedNorme;
    this.speedAngle = speedAngle;

    this.position.x = posX
    this.position.y = posY
    this.position.z = posZ
    this.center_camera()
  }

  updateAngle(degree) {
    let new_angle = camera.rotation.y + degree - Math.PI * 3 / 2;
    // if (collision(this)) return;
    camera.rotation.y += degree;
    this.rotation.y = new_angle
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
    // let old_x = this.x;
    // let old_y = this.y;
    console.log(camera.rotation.y);
    this.position.x = this.position.x + this.speedNorme * Math.cos(this.speedAngle);
    this.position.z = this.position.z + this.speedNorme * Math.sin(this.speedAngle);
    // if (collision(this)) {
    //   this.x = old_x;
    //   this.y = old_y;
    // }
    this.center_camera()
  }

  modifySpeedAngle(angle) {

  }

  create_3d_shape(img_path) {
    /** @type {BABYLON.Mesh} */
    var shape;
    // if (obj instanceof Char)
    switch (img_path) {
      case ObjectEnum.Char.name:
        shape = BABYLON.MeshBuilder.CreateCylinder("char",
          { height: Char.height, diameter: Char.depth }, scene);
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
        shape = BABYLON.MeshBuilder.CreateSphere("hole",
          { diameter: obj.sizex * 2 }, scene);
        break;
      default:
        shape = BABYLON.MeshBuilder.CreateBox("box",
          { height: Wall.height, width: Wall.width, depth: Wall.depth }, scene);
        break;
    }
    shape.material = createMaterial(scene, img_path);
    shape.showBoundingBox = true;
    return shape
  }
}