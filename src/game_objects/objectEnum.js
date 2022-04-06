class ObjectEnum {
  // Create new instances of the same class as static attributes
  static Bullet = new ObjectEnum(bulletImage.src, "")
  static Bonus = new ObjectEnum("bonus", "box", 0.4, 0.4, 0.4)
  static Tree = new ObjectEnum("tree", "ground_palm", 0.8, 1, 0.8)
  static Barrel = new ObjectEnum("barrel", "barrel", 24 / 40, 35 / 40, 24 / 40)
  static WallD = new ObjectEnum(wallDTexture.src, "")
  static Wall = new ObjectEnum(wallTexture.src, "")
  static Player = new ObjectEnum("player", "modern_tank", 38 / 40, 25 / 40, 70 / 40)
  static CharRed = new ObjectEnum("redTank", "modern_tank", 38 / 40, 25 / 40, 70 / 40)
  static CharBlue = new ObjectEnum("blueTank", "modern_tank", 38 / 40, 25 / 40, 70 / 40)
  static CharGreen = new ObjectEnum("greenTank", "modern_tank", 38 / 40, 25 / 40, 70 / 40)

  /*

  //Earthy Biome items
  static Rock = new ObjectEnum("rock", "rock", 0.4, 0.4, 0.4)
  static PalmTree1 = new ObjectEnum("ground_palm", "ground_palm", 0.8, 1, 0.8)
  static PalmTree2 = new ObjectEnum("palm_trees", "palm_trees", 0.8, 1, 0.8)
  static PalmTree3 = new ObjectEnum("coconut_tree", "coconut_tree", 0.8, 1, 0.8)

  //Sandy Biome items
  static Cactus1 = new ObjectEnum("cactus1", "cactus1", 0.8, 1, 0.8)
  static Cactus2 = new ObjectEnum("cactus2", "cactus2", 0.8, 1, 0.8)
  static Cactus3 = new ObjectEnum("cactus3", "cactus3", 0.8, 1, 0.8)
  static DesertRock = new ObjectEnum("desert_rock", "desert_rock", 0.4, 0.4, 0.4)
  static Tumbleweed = new ObjectEnum("tumbleweed", "tumbleweed", 0.4, 0.4, 0.4)

  //Snowy Biome items
  static SnowyTree = new ObjectEnum("snowy_tree", "snowy_tree", 0.8, 1, 0.8)
  static SnowyRock = new ObjectEnum("snowy_rock", "snowy_rock", 0.4, 0.4, 0.4)
  static SnowyFence = new ObjectEnum("snowy_fence", "snowy_fence", 0.4, 0.4, 0.4)
  static SnowyHut = new ObjectEnum("wintercabin", "wintercabin", 3, 2, 2)

  */

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
    let name = this.babylon_model
    if (name == "") { ObjectEnum.loadingDone(); return; }

    BABYLON.SceneLoader.ImportMesh("", "models/" + name + "/", name + ".obj", scene, (meshes) => {
      this.callback(meshes, this.babylon_model)
    })

  }

  callback(meshes, model) {

    this.meshes = [...meshes];

    // Resizing of each meshes
    if (model == "tree") {
      this.treeMeshes = [];
      let tempTreesList;
      let cont;

      for (let i = 0; i < TREES_LIST.length; i++) {
        tempTreesList = []
        for (let j = 0; j < TREES_LIST[i].length; j++) {
          let m = this.meshes.filter(e => e.name == TREES_LIST[i][j])[0]
          tempTreesList.push(m)
        }
        cont = BABYLON.MeshBuilder.CreateBox("container", { height: this.height, width: this.width, depth: this.depth }, scene);
        cont.position.y += this.height / 2;
        cont.visibility = false;

        tempTreesList.forEach(e => {
          e.parent = null
          cont.addChild(e)
        });
        tempTreesList.forEach(e => e.visibility = false)
        this.treeMeshes.push(cont)
      }
      ObjectEnum.loadingDone();
      return;
    }

    else if (model == "box") {
      this.meshes.forEach(x => {
        x.scaling = new BABYLON.Vector3(0.008, 0.008, 0.008)
      })

    }
    else if (model == "palm_trees") {
      this.meshes.forEach(x => {
        x.scaling = new BABYLON.Vector3(0.002, 0.002, 0.002)
      })
    }

    else if (model == "coconut_tree") {
      this.meshes.forEach(x => {
        x.scaling = new BABYLON.Vector3(0.02, 0.02, 0.02)
      })
    }
    else if (model == "tank") {
      this.meshes.forEach(x => {
        x.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25)
      })
    }
    else if (model == "modern_tank") {
      this.meshes.forEach(x => {
        x.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25)
      })
    }
    else if (model == "snowy_tree") {
      this.meshes.forEach(x => {
        x.scaling = new BABYLON.Vector3(0.025, 0.025, 0.025)
        x.backFaceCulling = false
      })
    }
    else if (model == "wintercabin") {
      this.meshes.forEach(x => {
        x.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01)
      })
    }




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
    var list_obj = [this.Bullet, this.CharBlue, this.CharGreen, this.CharRed, this.Barrel, this.Player, this.Wall, this.WallD, this.Bonus, this.Tree]
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