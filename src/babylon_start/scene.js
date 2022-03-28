/// <reference path="babylon.d.ts" />

var canvas = document.getElementById("myCanvas");
var ground;

canShoot = false;
/** @type {BABYLON.Mesh} */
var tankMeshes;
var opponentContainer;
var opponentMeshes;
var opponentMaterials;
/** @type {BABYLON.Engine} */
var engine;
var shadowGenerator;
var tanksAIReady;
var inMenu = true;

class Scene {

  constructor() {
    tanksAIReady = false;
    this.engine = new BABYLON.Engine(canvas, true);

    engine = this.engine;

    // window.addEventListener("resize", () => {
    //   engine.resize()
    // })

    window.onresize = function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      engine.resize();
    }

    window.onresize()

    engine.displayLoadingUI();
    this.scene = this.createScene();
    this.scene.menu = new Menu()
    this.setPhysic()
    this.setGround()
    this.setShadow()
    this.setBackground()
    this.setParticles()
    // this.setGizmo()
    this.setCamera()



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
    engine.runRenderLoop(() => scene.render())


    scene.beforeRender = () => {

      if (!inMenu) {
        bullets.forEach(bullet => bullet.physicsImpostor.applyForce(new BABYLON.Vector3(0, -gravity, 0), bullet.position))

        bullets.forEach(bullet => {
          if (bullet.position.x <= ground.position.x - width / 2 ||
            bullet.position.x >= ground.position.x + width / 2 ||
            bullet.position.z <= ground.position.z - height / 2 ||
            bullet.position.z >= ground.position.z + height / 2) {

            let index = bullets.indexOf(bullet)
            if (index !== -1) bullets.splice(index, 1)
            bullet.dispose()
          }
        })
        // charsAI.forEach(c => MoveAI.move(c));
        // if (tanksAIReady) charsAI.forEach(c => c.strategy.applyMovement())
        anime()
        //VERIFICATION TOUS CHARS ENNEMIS ELIMINES
        if (charsAI.length == 0) {
          level += 1;
          remove_all_objects()
          startgame(level);
        }
        charsAI.forEach(c => {
          if (c.life <= 0) {
            let index = chars.indexOf(c)
            if (index !== -1) chars.splice(index, 1)
            index = charsAI.indexOf(c)
            if (index !== -1) charsAI.splice(index, 1)
            c.dispose()
          }
        })
        if (char1.life <= 0 || level == level_map.length) {
          level = 0;
          remove_all_objects()
          startgame(level);
          this.menu.createButton()
        }
        //charsAI.forEach(c => MoveAI.move(c));
        charsAI.forEach(c => c.strategy.applyStrategy())
      }
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
    // camera.inputs.attached.keyboard.detachControl();
    // camera.checkCollisions = true;
    camera = new BABYLON.FollowCamera("tankCamera", ground.position, scene, ground);
    // camera.attachControl(canvas, true);
    camera.radius = 40;
    camera.heightOffset = 14;
    camera.rotationOffset = 50;
    camera.cameraAcceleration = .1;
    camera.maxCameraSpeed = 10;
  }

  setGround() {
    // ground = BABYLON.MeshBuilder.CreateGround("ground", { width: width + cell_size, height: height + cell_size }, scene);
    // var grass = new BABYLON.StandardMaterial("groundMat", scene);
    // grass.diffuseTexture = new BABYLON.Texture("images/grass.png", scene);
    // ground.material = grass
    // grass.specularColor = new BABYLON.Color3(0, 0, 0)

    // ground.checkCollisions = true;
    // ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 });

    const groundOptions = {
      width: width + cell_size,
      height: height + cell_size,
      subdivisions: 80,
      minHeight: -1,
      maxHeight: 0,
      onReady: onGroundCreated,
    };
    //scene is optional and defaults to the current scene
    ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
      "gdhm",
      "textures/ground.png",
      groundOptions,
      scene
    );

    function onGroundCreated() {
      const groundMaterial = new BABYLON.StandardMaterial(
        "groundMaterial",
        scene
      );
      groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground_diffuse.png");
      ground.material = groundMaterial;

      ground.receiveShadows = true
      groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
      // to be taken into account by collision detection
      ground.checkCollisions = true;
      //groundMaterial.wireframe=true;

      // for physic engine
      ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        ground,
        BABYLON.PhysicsImpostor.HeightmapImpostor,
        { mass: 0 },
        scene
      );
    }

    return ground;
  }

  setShadow() {
    var light = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(25, -25, 0), scene);
    light.intensity = 1;
    light.position = new BABYLON.Vector3(0, 100, 0);
    shadowGenerator = new BABYLON.ShadowGenerator(256, light)
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurScale = 0.5;
    shadowGenerator.setDarkness(0.3);
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
// /** @type{BABYLON.Scene} */
// let scene2;
// let createScene2 = () => {
//   scene2 = new BABYLON.Scene(engine);
//   camera2 = new BABYLON.CAMERA("camera2", new )
// }