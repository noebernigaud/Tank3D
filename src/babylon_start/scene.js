/// <reference path="babylon.d.ts" />

var canvas = document.getElementById("myCanvas");
var tanksMeshes;

class Scene {

  constructor() {
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = this.createScene();

    this.engine.runRenderLoop(() =>
      this.scene.render()
    );

    // this.setBackground()
    this.addTank()
    init()
  }

  /**
   * @returns {BABYLON.Scene}
   */
  createScene() {
    scene = new BABYLON.Scene(this.engine);

    camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 385, -796), scene);

    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    light.intensity = 0.5;

    var gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);

    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: width + cell_size, height: height + cell_size }, scene);
    ground.material = createMaterial(scene, 'images/woodTexture.jpg')
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 5 });
    return scene;
  }

  setBackground() {
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/sky/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
  }

  async addTank() {
    model = BABYLON.SceneLoader.ImportMeshAsync("", "./models/", "tank.babylon").then((meshes) => {
      tanksMeshes = [
        scene.getMeshById('Body_1'),
        scene.getMeshById('Body_2'),
        scene.getMeshById('Track'),
        scene.getMeshById('Turret'),
        scene.getMeshById('Turret_2'),
        scene.getMeshById('LightPreset'),
      ]

      tanksMeshes.forEach(x => x.scaling = new BABYLON.Vector3(40, 40, 40));

      tanksMeshes.forEach(x => x.physicsImpostor = new BABYLON.PhysicsImpostor(x, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }))
    });
  }

  // old() {

  //   window.initFunction = async function () {

  //     var asyncEngineCreation = async function () {
  //       try {
  //         return createDefaultEngine();
  //       } catch (e) {

  //         return createDefaultEngine();
  //       }
  //     }

  //     window.engine = await asyncEngineCreation();
  //     if (!engine) throw 'engine should not be null.';
  //     startRenderLoop(engine, canvas);
  //     window.scene = createScene();
  //   };
  //   initFunction().then(() => {
  //     sceneToRender = scene
  //   });

  //   // Resize
  //   window.addEventListener("resize", function () {
  //     engine.resize();
  //   });
  // }
}

