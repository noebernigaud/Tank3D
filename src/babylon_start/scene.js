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
    this.setGround()
    this.setShadow()
    this.setBackground()
    this.setParticles()
    // this.setGizmo()
    // this.setCamera()



    ObjectEnum.initiate_all_models()
    // this.setCamera()
    // this.engine.runRenderLoop(() =>
    //   this.scene.render()
    // )


  }

  /**
   * @returns {BABYLON.Scene}
   */
  createScene() {
    scene = new BABYLON.Scene(this.engine);

    scene.beforeRender = () => {
      bullets.forEach(bullet => bullet.physicsImpostor.applyForce(new BABYLON.Vector3(0, -gravity, 0), bullet.position))

      bullets.forEach(bullet => {
        if (bullet.position.x <= ground.position.x - width / 2
          || bullet.position.x >= ground.position.x + width / 2
          || bullet.position.z <= ground.position.z - height / 2
          || bullet.position.z >= ground.position.z + height / 2) {

          let index = bullets.indexOf(bullet)
          if (index !== -1) bullets.splice(index, 1)
          bullet.trail.dispose()
          bullet.dispose()
        }
      })
    }
    return scene;
  }

  setPhysic() {
    var gravityVector = new BABYLON.Vector3(0, gravity, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);
  }

  setCamera() {
    // camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    // camera.setPosition(new BABYLON.Vector3(0, 100 / 20, -110 / 20));
    // camera.beta += 0.3
    // camera.angularSensibilityX = 250
    // camera.angularSensibilityY = 250
    // camera.inertia = 0
    // camera.attachControl(canvas, true);
    // camera.inputs.attached.keyboard.detachControl();
    // camera.checkCollisions = true;
    camera = new BABYLON.FollowCamera("tankCamera", ground.position, scene, ground);
    camera.radius = 40;
    camera.heightOffset = 14;
    camera.rotationOffset = 50;
    camera.cameraAcceleration = .1;
    camera.maxCameraSpeed = 10;
  }

  setGround() {
    ground = BABYLON.MeshBuilder.CreateGround("ground", { width: width + cell_size, height: height + cell_size }, scene);
    var grass = new BABYLON.StandardMaterial("groundMat", scene);
    grass.diffuseTexture = new BABYLON.Texture("images/grass.png", scene);
    ground.material = grass
    grass.specularColor = new BABYLON.Color3(0, 0, 0)

    ground.checkCollisions = true;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 });
    ground.receiveShadows = true
  }

  setShadow() {
    var light = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(25, -25, 0), scene);
    light.intensity = 1;
    light.position = new BABYLON.Vector3(0, 100, 0);
    shadowGenerator = new BABYLON.ShadowGenerator(256, light)
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurScale = 1;
    shadowGenerator.setDarkness(0.2);
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

  setGizmo() {
    var gizmoManager = new BABYLON.GizmoManager(scene);
    gizmoManager.positionGizmoEnabled = true;
    gizmoManager.rotationGizmoEnabled = true;
    gizmoManager.scaleGizmoEnabled = true;
    gizmoManager.boundingBoxGizmoEnabled = true;
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