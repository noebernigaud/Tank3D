/// <reference path="babylon.d.ts" />

var canvas = document.getElementById("myCanvas");

class Scene {

  constructor() {
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = this.createScene();


    this.engine.runRenderLoop(() =>
      this.scene.render()
    );

    this.setBackground()

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

    var gravityVector = new BABYLON.Vector3(0, 0, 0);
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


  old() {

    window.initFunction = async function () {


      var asyncEngineCreation = async function () {
        try {
          return createDefaultEngine();
        } catch (e) {

          return createDefaultEngine();
        }
      }

      window.engine = await asyncEngineCreation();
      if (!engine) throw 'engine should not be null.';
      startRenderLoop(engine, canvas);
      window.scene = createScene();
    };
    initFunction().then(() => {
      sceneToRender = scene
    });

    // Resize
    window.addEventListener("resize", function () {
      engine.resize();
    });
  }
}