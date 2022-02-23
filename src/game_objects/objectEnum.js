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

  callback(tankMeshes) {
    tankMeshes.forEach(x => x.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25));
    //tankMeshes.forEach(x => x.position.y += 30);
    tankContainer = BABYLON.MeshBuilder.CreateBox("tankContainer", { height: this.height, width: this.width, depth: this.depth }, scene);
    tankContainer.position.y += this.height / 2;
    tankMeshes.forEach(e => tankContainer.addChild(e));

    //tankContainer.isVisible = false;
    tankContainer.visibility = 0.000001;
    tankContainer.showBoundingBox = true;
    // camera.target = getTurretTank();
    //tankContainer.visibility = false;
    //tankMeshes.forEach(e => e.visibility = false)
    this.meshes = this.meshes;
    this.tankContainer = tankContainer;
    ObjectEnum.loadingDone();
  }

  static initiate_all_models() {
    var list_obj = [this.Bullet, this.CharBlue, this.CharGreen, this.CharRed, this.Hole, this.Mine, this.Player, this.Wall, this.WallD]
    this.remainingLoad = list_obj.length
    console.log(this.remainingLoad + "bonjour");
    list_obj.forEach(e => e.create_model())

  }

  static loadingDone() {
    this.remainingLoad--;
    console.log(this.remainingLoad);
    if (this.remainingLoad == 0) {
      engine.hideLoadingUI()
      init()
    }
  }
}
