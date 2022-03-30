var TREE_MESHES;
class ObjectEnum {
  // Create new instances of the same class as static attributes
  static Bullet = new ObjectEnum(bulletImage.src, "")
  static Bonus = new ObjectEnum(bonusImage.src, "box", 0.5, 0.5, 0.5)
  static Barrel = new ObjectEnum(barrelImage.src, "barrel", 24 / 40, 35 / 40, 24 / 40)
  static WallD = new ObjectEnum(wallDTexture.src, "")
  static Wall = new ObjectEnum(wallTexture.src, "")
  static Mine = new ObjectEnum(mineImage.src, "")
  static Player = new ObjectEnum(tankImage.src, "tank", 38 / 40, 25 / 40, 70 / 40)
  static CharRed = new ObjectEnum(tankImageRed.src, "tank", 38 / 40, 25 / 40, 70 / 40
  )
  static CharBlue = new ObjectEnum(tankImageBlue.src, "tank", 38 / 40, 25 / 40, 70 / 40
  )
  static CharGreen = new ObjectEnum(tankImageGreen.src, "tank", 38 / 40, 25 / 40, 70 / 40
  )

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
    if (this.babylon_model == "barrel" || this.babylon_model == "tree") {
      BABYLON.SceneLoader.ImportMesh("", "models/" + this.babylon_model + "/", this.babylon_model + ".gltf", scene, (meshes) => {
        this.callback(meshes, false, false, this.babylon_model)
      });
      return;
    }
    else BABYLON.SceneLoader.ImportMesh("", "models/" + this.babylon_model + "/", this.babylon_model + ".babylon", scene, (meshes) => {
      this.callback(meshes, true, this.babylon_model == "box", this.babylon_model)

    });
  }

  callback(meshes, toResize, isBox = false, model) {

    this.meshes = [...meshes];

    // Resizing of each meshes
    if (model == "tree") {

      this.meshes.forEach(x => {
        x.isVisible = TREES_LIST[0].includes(x.name)
      })
    }
    if (toResize) this.meshes.forEach(x => {
      if (isBox) {
        x.position.y -= 0.225
      }
      x.scaling = isBox ? new BABYLON.Vector3(0.50, 0.50, 0.50) : new BABYLON.Vector3(0.25, 0.25, 0.25)

    });

    // Parent mesh (the original which we will duplicate to create our objects)
    this.container = BABYLON.MeshBuilder.CreateBox("container", { height: this.height, width: this.width, depth: this.depth }, scene);
    this.container.position.y += this.height / 2;
    if (model == "tree") {

      this.meshes.forEach(e => {
        e.position.x = this.container.position.x
        e.position.y = this.container.position.y
        e.position.z = this.container.position.z
      })
    }
    this.meshes.forEach(e => this.container.addChild(e));

    // Hiding of the mesh
    // this.container.visibility = 0.000001;
    this.container.visibility = false;
    // this.container.showBoundingBox = true;
    this.meshes.forEach(e => e.visibility = false)

    ObjectEnum.loadingDone();
  }

  static initiate_all_models() {
    var list_obj = [this.Bullet, this.CharBlue, this.CharGreen, this.CharRed, this.Barrel, this.Mine, this.Player, this.Wall, this.WallD, this.Bonus]
    this.remainingLoad = list_obj.length + 1
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


const TREES_LIST = [
  ["Tree-01-1_primitive0",
    "Tree-01-1_primitive1",
    "Tree-01-1_primitive2"],
  ["Tree-01-2_primitive0",
    "Tree-01-2_primitive1",
    "Tree-01-2_primitive2"],
  ["Tree-01-3_primitive0",
    "Tree-01-3_primitive1",
    "Tree-01-3_primitive2"],
  ["Tree-01-4_primitive0",
    "Tree-01-4_primitive1",
    "Tree-01-4_primitive2"],
  ["Tree-02-1_primitive0",
    "Tree-02-1_primitive1",
    "Tree-02-1_primitive2"],
  ["Tree-02-2_primitive0",
    "Tree-02-2_primitive1",
    "Tree-02-2_primitive2"],
  ["Tree-02-3_primitive0",
    "Tree-02-3_primitive1",
    "Tree-02-3_primitive2"],
  ["Tree-02-4_primitive0",
    "Tree-02-4_primitive1",
    "Tree-02-4_primitive2"],
  ["Tree-03-1_primitive0",
    "Tree-03-1_primitive1",
    "Tree-03-1_primitive2"],
  ["Tree-03-2_primitive0",
    "Tree-03-2_primitive1",
    "Tree-03-2_primitive2"],
  ["Tree-03-3_primitive0",
    "Tree-03-3_primitive1",
    "Tree-03-3_primitive2"],
  ["Tree-03-4_primitive0",
    "Tree-03-4_primitive1",
    "Tree-03-4_primitive2"],
  ["Hedge-01_primitive0",
    "Hedge-01_primitive1"],
  ["Bush-01_primitive0",
    "Bush-01_primitive1"],
  ["Bush-02_primitive0",
    "Bush-02_primitive1"],
  ["Bush-03_primitive0",
    "Bush-03_primitive1"],
  ["Bush-04_primitive0",
    "Bush-04_primitive1"],
  ["Bush-05_primitive0",
    "Bush-05_primitive1",
    "Bush-05_primitive2"],
  ["Clover-01"],
  ["Clover-02"],
  ["Clover-03"],
  ["Clover-04"],
  ["Clover-05"],
  ["Grass-01_primitive0",
    "Grass-01_primitive1"],
  ["Grass-02_primitive0",
    "Grass-02_primitive1"],
  ["Grass-03_primitive0",
    "Grass-03_primitive1"],
  ["Flowers-02_primitive0",
    "Flowers-02_primitive1",
    "Flowers-02_primitive2",
    "Flowers-02_primitive3"],
  ["Flowers-04_primitive0",
    "Flowers-04_primitive1",
    "Flowers-04_primitive2",
    "Flowers-04_primitive3"],
  ["Flowers-01"],
  ["Flowers-03"]
];