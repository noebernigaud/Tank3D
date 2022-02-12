/// <reference path="babylon.d.ts" />

var canvas = document.getElementById("myCanvas");
var model;
var model2;
var ground;
var tankContainer;
var tankMeshes;
var opponentContainer;
var opponentMeshes;
var opponentMaterials;
var engine;

class Scene {

  constructor() {
    this.engine = new BABYLON.Engine(canvas, true);

    engine = this.engine;
    engine.displayLoadingUI();
    this.scene = this.createScene();
    this.setPhysic()
    this.setCamera()
    this.setGround()

    this.engine.runRenderLoop(() =>
      this.scene.render()
    );

    this.setBackground()
    this.setParticles()

    loadModel()
  }

  /**
   * @returns {BABYLON.Scene}
   */
  createScene() {
    scene = new BABYLON.Scene(this.engine);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.5;

    return scene;
  }

  setPhysic() {
    var gravityVector = new BABYLON.Vector3(0, 0, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);
  }

  setCamera() {
    camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(0, 100, -110));
    camera.beta += 0.3
    camera.angularSensibilityX = 250
    camera.angularSensibilityY = 250
    camera.inertia = 0
    camera.attachControl(canvas, true);
    camera.inputs.attached.keyboard.detachControl();
    camera.checkCollisions = true;
  }

  setGround() {
    ground = BABYLON.MeshBuilder.CreateGround("ground", { width: width + cell_size, height: height + cell_size }, scene);
    ground.material = createMaterial(scene, 'images/woodTexture.jpg')
    ground.checkCollisions = true;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 5 });
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

  setParticles() {
    // Set up new rendering pipeline
    var pipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene);

    // Tone mapping
    scene.imageProcessingConfiguration.toneMappingEnabled = true;
    scene.imageProcessingConfiguration.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
    scene.imageProcessingConfiguration.exposure = 1;

    // Bloom
    pipeline.bloomEnabled = true;
    pipeline.bloomThreshold = 0.8;
    pipeline.bloomWeight = 0.3;
    pipeline.bloomKernel = 64;
    pipeline.bloomScale = 0.5;
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