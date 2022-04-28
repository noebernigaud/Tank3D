class ObjectEnum {
  // Create new instances of the same class as static attributes

  //Element of decor
  static Barrel = new ObjectEnum("barrel", "barrel", 0.65, 0.375, 0.6, 0.375)
  static WallD = new ObjectEnum(wallDTexture.src, "")
  static Wall = new ObjectEnum(wallTexture.src, "")

  //Player
  static Player = new ObjectEnum("player", "modern_tank", 0.25, 0.95, 0.625, 1.75)
  static Bonus = new ObjectEnum("bonus", "box", 0.008, 0.4, 0.4, 0.4)
  static Bullet = new ObjectEnum(bulletImage.src, "")
  static GrenadeObj = new ObjectEnum(bulletImage.src, "")

  //Opponent Tanks
  static MiniTank = new ObjectEnum("miniTank", "mini_tank", 0.25, 0.625, 0.625, 1.25)
  static EarthTank = new ObjectEnum("earthTank", "modern_tank", 0.25, 0.95, 0.625, 1.75)
  static SandTank = new ObjectEnum("sandTank", "desert_tank", 0.5, 0.95, 0.625, 1.75)
  static SnowTank = new ObjectEnum("snowTank", "battle_tank", 0.2, 0.95, 0.625, 1.75)

  //Earthy Biome items
  static Rock = new ObjectEnum("rock", "rock", 0.5, 0.5, 0.5, 0.5)
  static PalmTree1 = new ObjectEnum("ground_palm", "ground_palm", 1, 0.8, 1, 0.8)
  static PalmTree2 = new ObjectEnum("merged_palm_tree", "merged_palm_tree", 0.4, 0.8, 1, 0.8)
  static PalmTree3 = new ObjectEnum("coconut_tree", "coconut_tree", 0.02, 0.8, 1, 0.8)

  //Sandy Biome items
  static Cactus1 = new ObjectEnum("cactus1", "cactus1", 0.5, 0.8, 1, 0.8)
  static Cactus2 = new ObjectEnum("cactus2", "cactus2", 0.2, 0.8, 1, 0.8)
  static Cactus3 = new ObjectEnum("cactus3", "cactus3", 0.15, 0.8, 1, 0.8)
  static DesertRock = new ObjectEnum("desert_rock", "desert_rock", 0.5, 0.8, 0.8, 0.8)
  static Tumbleweed = new ObjectEnum("tumbleweed", "tumbleweed", 1, 0.4, 0.4, 0.4)

  //Snowy Biome items
  static SnowyTree = new ObjectEnum("snowy_tree", "snowy_tree", 0.025, 0.8, 1, 0.8)
  static SnowyFir = new ObjectEnum("snowy_fir", "snowy_fir", 0.5, 0.8, 1, 0.8)
  static SnowyRock = new ObjectEnum("snowy_rock", "snowy_rock", 0.15, 0.4, 0.4, 0.4)
  static SnowyFence = new ObjectEnum("snowy_fence", "snowy_fence", 0.015, 0.4, 0.4, 0.4)
  static SnowyHut = new ObjectEnum("wintercabin", "wintercabin", 0.01, 3, 2, 2)

  static load1 = {
    Snow: {
      id: 0,
      elts: [ObjectEnum.SnowTank,
      ObjectEnum.SnowyTree, ObjectEnum.SnowyFir,
      ObjectEnum.SnowyRock, ObjectEnum.SnowyFence, ObjectEnum.SnowyHut],
      charged: false
    },
    Earth: {
      id: 1,
      elts: [
        this.Bullet, this.MiniTank, this.Barrel, this.Player, this.Wall, this.WallD, this.Bonus,
        this.Rock, this.PalmTree1, this.PalmTree2, this.PalmTree3, ObjectEnum.EarthTank],
      charged: false
    },
    Sand: {
      id: 2,
      elts: [ObjectEnum.SandTank, ObjectEnum.Cactus1, ObjectEnum.Cactus2,
      ObjectEnum.Cactus3, ObjectEnum.DesertRock, ObjectEnum.Tumbleweed], charged: false
    }
  }


  /** @type {BABYLON.Mesh}*/
  container;
  remainingLoad;

  constructor(name, babylon_model, resize, width, height, depth) {
    this.name = name
    this.babylon_model = babylon_model;
    this.resize = resize
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

    this.meshes.forEach(x => {
      x.scaling = new BABYLON.Vector3(this.resize, this.resize, this.resize)
    })

    // Parent mesh (the original which we will duplicate to create our objects)
    if (model == "barrel") {
      this.container = BABYLON.MeshBuilder.CreateCylinder("container", { height: this.height, diameter: 0.37 }, scene);
    } else if (model == "tumbleweed") {
      this.container = BABYLON.MeshBuilder.CreateSphere("container", { diameter: 0.50 }, scene);
    } else if (model == "cactus1" || model == "snowy_tree" || model == "snowy_fir" || model == "merged_palm_tree" || model == "coconut_tree") {
      this.container = BABYLON.MeshBuilder.CreateCylinder("container", { height: this.height, diameter: 0.37 }, scene);
    }
    else {
      this.container = BABYLON.MeshBuilder.CreateBox("container", { height: this.height, width: this.width, depth: this.depth }, scene);
    }
    // this.container = BABYLON.MeshBuilder.CreateBox("container", { height: this.height, width: this.width, depth: this.depth }, scene);
    this.container.position.y += this.height / 2;
    this.meshes.forEach(e => this.container.addChild(e));

    // Hiding of the mesh
    // this.container.visibility = 1;
    this.container.visibility = false;
    // this.container.showBoundingBox = true;
    this.meshes.forEach(e => e.visibility = false)

    ObjectEnum.loadingDone();
  }

  static initiate_all_models(biom) {
    if (biom.charged) return;
    var list_obj = biom.elts;
    engine.displayLoadingUI();
    document.getElementsByClassName('loadingBarMain')[0].classList.remove('hide')

    this.remainingLoad = list_obj.length
    this.globalLen = list_obj.length
    list_obj.forEach(e => e.create_model())
    biom.charged = true;
  }

  static loadingDone() {
    if (engine) engine.stopRenderLoop()
    this.remainingLoad--;
    let done = this.globalLen - this.remainingLoad;
    let stat = Math.round(done / this.globalLen * 10000) / 100 + "%";
    let bar = document.getElementsByClassName('loadingBarChild')[0];
    bar.style.width = stat;
    bar.innerHTML = stat;
    if (this.remainingLoad == 0) {
      setTimeout(() => {
        document.getElementsByClassName('loadingBarChild')[0].innerHTML = "Loading Done - Game Will Start Soon";
        setTimeout(() => {
          document.getElementsByClassName('loadingBarMain')[0].classList.add('hide')
          // document.getElementById('main').classList.add('hide')
          engine.hideLoadingUI()
          // scene.menu.toggleNotMenuElement(true)
          init()
          draw_level_map()
          startRenderLoop()
          // document.getElementById()
          scene.menu.show(false)
        }, 1000);
      }, 500);
    }
  }
}