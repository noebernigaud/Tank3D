class ObjectEnum {
  // Create new instances of the same class as static attributes

  //Element of decor
  static Barrel = new ObjectEnum("barrel", "barrel", 15 / 40, 24 / 40, 15 / 40)
  static WallD = new ObjectEnum(wallDTexture.src, "")
  static Wall = new ObjectEnum(wallTexture.src, "")

  //Player
  static Player = new ObjectEnum("player", "modern_tank", 38 / 40, 25 / 40, 70 / 40)
  static Bonus = new ObjectEnum("bonus", "box", 0.4, 0.4, 0.4)
  static Bullet = new ObjectEnum(bulletImage.src, "")

  //Opponent Tanks
  static CharRed = new ObjectEnum("redTank", "mini_tank", 25 / 40, 25 / 40, 50 / 40)
  static CharBlue = new ObjectEnum("blueTank", "battle_tank", 38 / 40, 25 / 40, 70 / 40)
  static CharGreen = new ObjectEnum("greenTank", "tiger_tank", 38 / 40, 25 / 40, 70 / 40)

  //Earthy Biome items
  static Rock = new ObjectEnum("rock", "rock", 0.5, 0.5, 0.5)
  static PalmTree1 = new ObjectEnum("ground_palm", "ground_palm", 0.8, 1, 0.8)
  static PalmTree2 = new ObjectEnum("palm_trees", "palm_trees", 0.8, 1, 0.8)
  static PalmTree3 = new ObjectEnum("coconut_tree", "coconut_tree", 0.8, 1, 0.8)

  //Sandy Biome items
  static Cactus1 = new ObjectEnum("cactus1", "cactus1", 0.8, 1, 0.8)
  static Cactus2 = new ObjectEnum("cactus2", "cactus2", 0.8, 1, 0.8)
  static Cactus3 = new ObjectEnum("cactus3", "cactus3", 0.8, 1, 0.8)
  static DesertRock = new ObjectEnum("desert_rock", "desert_rock", 0.8, 0.8, 0.8)
  static Tumbleweed = new ObjectEnum("tumbleweed", "tumbleweed", 0.4, 0.4, 0.4)

  //Snowy Biome items
  static SnowyTree = new ObjectEnum("snowy_tree", "snowy_tree", 0.8, 1, 0.8)
  static SnowyRock = new ObjectEnum("snowy_rock", "snowy_rock", 0.4, 0.4, 0.4)
  static SnowyFence = new ObjectEnum("snowy_fence", "snowy_fence", 0.4, 0.4, 0.4)
  static SnowyHut = new ObjectEnum("wintercabin", "wintercabin", 3, 2, 2)


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
    let resize;
    switch (model) {
      case "box": resize = 0.008; break;
      case "palm_trees": resize = 0.002; break;
      case "coconut_tree": resize = 0.02; break;
      case "tank": resize = 0.25; break;
      case "modern_tank": resize = 0.25; break;
      case "battle_tank": resize = 0.20; break;
      case "tiger_tank": resize = 0.25; break;
      case "mini_tank": resize = 0.25; break;
      case "snowy_tree": resize = 0.025; break;
      case "wintercabin": resize = 0.01; break;
      case "cactus1": resize = 0.5; break;
      case "cactus2": resize = 0.2; break;
      case "cactus3": resize = 0.15; break;
      case "snowy_rock": resize = 0.15; break;
      case "snowy_fence": resize = 0.015; break;
      case "rock": resize = 0.5; break;
      case "barrel": resize = 0.65; break;
      case "desert_rock": resize = 0.5; break;
      case "barrel":
      case "ground_palm":
      case "tumbleweed":
      default: resize = 1;

    }

    this.meshes.forEach(x => {
      x.scaling = new BABYLON.Vector3(resize, resize, resize)
    })

    // Parent mesh (the original which we will duplicate to create our objects)
    if (model == "barrel") {
      this.container = BABYLON.MeshBuilder.CreateCylinder("container", { height: this.height, diameter: 0.37 }, scene);
    } else {
      this.container = BABYLON.MeshBuilder.CreateBox("container", { height: this.height, width: this.width, depth: this.depth }, scene);
    }
    // this.container = BABYLON.MeshBuilder.CreateBox("container", { height: this.height, width: this.width, depth: this.depth }, scene);
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
    var list_obj = [
      this.Bullet, this.CharBlue, this.CharGreen, this.CharRed, this.Barrel, this.Player, this.Wall, this.WallD, this.Bonus,
      this.Rock, this.PalmTree1, this.PalmTree2, this.PalmTree3, this.Cactus1, this.Cactus2, this.Cactus3, this.DesertRock,
      this.Tumbleweed, this.SnowyTree, this.SnowyRock, this.SnowyFence, this.SnowyHut
    ]
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