/// <reference path="babylon.d.ts" />

var canvas = document.getElementById("myCanvas");
var ground;

/** @type {BABYLON.Mesh} */
var tankMeshes;
var opponentContainer;
var opponentMeshes;
var opponentMaterials;
var engine;
var shadowGenerator;

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


    ObjectEnum.initiate_all_models()
    // loadModel()
  }

  /**
   * @returns {BABYLON.Scene}
   */
  createScene() {
    scene = new BABYLON.Scene(this.engine);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.5;

    scene.beforeRender = () => {
      bullets.forEach(bullet => bullet.physicsImpostor.applyForce(new BABYLON.Vector3(0, -gravity, 0), bullet.position))
    }
    return scene;
  }

  setPhysic() {
    var gravityVector = new BABYLON.Vector3(0, gravity, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);
  }

  setCamera() {
    camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(0, 100 / 20, -110 / 20));
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
    var grass0 = new BABYLON.StandardMaterial("grass0", scene);
    grass0.diffuseTexture = new BABYLON.Texture("images/grass.png", scene);
    // var material = createMaterial(scene, 'images/grass.png')
    // material.diffuseColor = new BABYLON.Color3(1, 1, 1)

    // material.ambientColor = new BABYLON.Color3(1, 1, 1)
    ground.material = grass0


    // var furMaterial = new BABYLON.FurMaterial("fur_material", scene)
    // furMaterial.furLength = 0.1; // Represents the maximum length of the fur, which is then adjusted randomly. Default value is 1.
    // furMaterial.furAngle = Math.PI / 6; // Represents the angle the fur lies on the mesh from 0 to Math.PI/2. The default angle of 0 gives fur sticking straight up and PI/2 lies along the mesh.
    // furMaterial.furColor = new BABYLON.Color3(0.07, 0.83, 0.2); // is the default color if furColor is not set.
    // ground.material = furMaterial
    ground.checkCollisions = true;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 });
    ground.receiveShadows = true

    var light = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(0, -1, 1), scene)
    light.intensity = 0.5
    shadowGenerator = new BABYLON.ShadowGenerator(512, light)
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurScale = 2;
    shadowGenerator.setDarkness(0.99);
  }

  setBackground() {
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 100.0 }, scene);
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