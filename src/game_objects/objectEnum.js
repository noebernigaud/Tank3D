x = 0;
y = 0;

class ObjectEnum {
  // Create new instances of the same class as static attributes
  static Bullet = new ObjectEnum(bulletImage.src, "")
  static Hole = new ObjectEnum(holeImage.src, "")
  static WallD = new ObjectEnum(wallDTexture.src, "")
  static Wall = new ObjectEnum(wallTexture.src, "")
  static Mine = new ObjectEnum(mineImage.src, "")
  static Player = new ObjectEnum(tankImage.src, "tank", 38 / 40, 25 / 40, 70 / 40)
  static CharRed = new ObjectEnum(tankImageRed.src, "")
  static CharBlue = new ObjectEnum(tankImageBlue.src, "")
  static CharGreen = new ObjectEnum(tankImageGreen.src, "")

  /** @type {BABYLON.Mesh}*/
  container;
  remainingLoad;

  constructor(name, babylon_model, width, height, depth) {
    this.name = name
    this.babylon_model = babylon_model;
    this.width = width;
    this.height = height;
    this.depth = depth;
  }
  create_model() {
    if (this.babylon_model == "") { ObjectEnum.loadingDone(); return };
    BABYLON.SceneLoader.ImportMesh("", "models/" + this.babylon_model + "/", this.babylon_model + ".babylon", scene, (meshes) => {
      this.callback(meshes)
    });
  }

  callback(meshes) {
    this.meshes = [...meshes];

    // Resizing of each meshes
    this.meshes.forEach(x => x.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25));

    // Parent mesh (the original which we will duplicate to create our objects)
    this.container = BABYLON.MeshBuilder.CreateBox("container", { height: this.height, width: this.width, depth: this.depth }, scene);
    this.container.position.y += this.height / 2;
    this.meshes.forEach(e => this.container.addChild(e));

    // Hiding of the mesh
    // this.container.visibility = 0.000001;
    this.container.visibility = false;
    // this.container.showBoundingBox = true;
    this.meshes.forEach(e => e.visibility = false)

    ObjectEnum.loadingDone();
  }

  static initiate_all_models() {
    var list_obj = [this.Bullet, this.CharBlue, this.CharGreen, this.CharRed, this.Hole, this.Mine, this.Player, this.Wall, this.WallD]
    this.remainingLoad = list_obj.length
    list_obj.forEach(e => e.create_model())

  }

  static loadingDone() {
    this.remainingLoad--;
    if (this.remainingLoad == 0) {
      engine.hideLoadingUI()
      init()
    }
  }
}
