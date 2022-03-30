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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    tanksAIReady = false;
    this.engine = new BABYLON.Engine(canvas, true);

    engine = this.engine;

    // window.addEventListener("resize", () => {
    //   engine.resize()
    // })

    engine.displayLoadingUI();
    this.scene = this.createScene();
    this.scene.minimap = new MiniMap()
    this.scene.menu = new Menu()
    this.setPhysic()
    this.setGround()
    this.setShadow()
    // this.setFog()
    this.setBackground()
    this.setParticles()
    // this.setGizmo()
    this.setCamera()
    setCurrentLevelDico()




    ObjectEnum.initiate_all_models()
    // this.setCamera()
    // this.engine.runRenderLoop(() =>
    //   this.scene.render()
    // )

    window.onresize = function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.getElementById("src").style.width = window.innerWidth + "pt";
      document.getElementById("src").style.height = window.innerHeight + "pt";

      scene.minimap.resize()
      engine.resize();
    }

    window.onresize()
  }

  /**
   * @returns {BABYLON.Scene}
   */
  createScene() {
    scene = new BABYLON.Scene(this.engine);
    engine.runRenderLoop(() => scene.render())


    scene.beforeRender = () => {

      if (!this.scene.menu.isShown) {
        bullets.forEach(bullet => bullet.physicsImpostor.applyForce(new BABYLON.Vector3(0, -gravity, 0), bullet.position))

        bullets.forEach(bullet => {
          if (bullet.position.x <= ground.position.x - 100 ||
            bullet.position.x >= ground.position.x + 101 ||
            bullet.position.z <= ground.position.z - 100 ||
            bullet.position.z >= ground.position.z + 101 ||
            bullet.position.y < ground.position.y - 3) {
            let index = bullets.indexOf(bullet)
            if (index !== -1) bullets.splice(index, 1)
            bullet.dispose(true, true)
          }
        })
        chars.forEach(c => {
          if (c.shape.position.y < ground.position.y - 5) {
            c.life = 0;
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
          this.scene.menu.createButton()
        }
        //charsAI.forEach(c => MoveAI.move(c));
        charsAI.forEach(c => c.strategy.applyStrategy())
        this.scene.minimap.redraw()
      } else {
        this.scene.minimap.hide()
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
      minHeight: current_level_dico.minHeightMap,
      maxHeight: 0,
      onReady: () => onGroundCreated(this),
    };
    //scene is optional and defaults to the current scene
    ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
      "gdhm",
      "textures/heightmap3.png",
      groundOptions,
      scene
    );

    function onGroundCreated(myScene) {
      const groundMaterial = new BABYLON.StandardMaterial(
        "groundMaterial",
        scene
      );
      groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground_diffuse8k.png", scene, null, true, null, function () {
        ObjectEnum.loadingDone();
      });
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

      myScene.setWater(ground);
    }


    return ground;
  }

  setWater(gr) {
    //sand ground
    var groundTexture = new BABYLON.Texture("textures/sand.jpg", scene);
    groundTexture.vScale = groundTexture.uScale = 4.0;

    var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = groundTexture;

    var groundSand = BABYLON.MeshBuilder.CreateGround("groundSand", { height: 128, width: 128, subdivisions: 32 }, scene);
    groundSand.position.y = gr.position.y - 0.2
    groundSand.material = groundMaterial;

    //water ground
    var waterMesh = BABYLON.MeshBuilder.CreateGround("waterMesh", { height: 256, width: 256, subdivisions: 32 }, scene);
    waterMesh.position.y = gr.position.y - 0.2
    var water = new BABYLON.WaterMaterial("water", scene, new BABYLON.Vector2(256, 256));
    water.backFaceCulling = true;
    water.bumpTexture = new BABYLON.Texture("textures/waterbump.png", scene);
    water.windForce = -5;
    water.waveHeight = 0.1;
    water.bumpHeight = 0.1;
    water.waveLength = 0.1;
    water.colorBlendFactor = 0;
    water.addToRenderList(this.skybox);
    water.addToRenderList(groundSand);
    waterMesh.material = water;
    // var waterMesh = BABYLON.MeshBuilder.CreateGround("waterMesh", { height: 512, width: 512, subdivisions: 32 }, scene);
    // waterMesh.position.y = gr.position.y - 2.2
    // var water = new BABYLON.WaterMaterial("water", scene, new BABYLON.Vector2(1024, 1024));
    // water.backFaceCulling = true;
    // water.bumpTexture = new BABYLON.Texture("textures/waterbump.png", scene);
    // water.windForce = -5;
    // water.waveHeight = 0.5;
    // water.bumpHeight = 0.3;
    // water.waveLength = 0.1;
    // water.colorBlendFactor = 0;

    // water.addToRenderList(gr);
    // water.addToRenderList(this.skybox);

    // waterMesh.material = water;
  }

  setShadow() {
    var light = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(25, -25, 0), scene);
    light.intensity = 1.5;
    light.position = new BABYLON.Vector3(0, 100, 0);
    shadowGenerator = new BABYLON.ShadowGenerator(256, light)
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurScale = 0.5;
    shadowGenerator.setDarkness(0.3);
  }

  setFog() {
    // scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    //BABYLON.Scene.FOGMODE_NONE;
    //BABYLON.Scene.FOGMODE_EXP2;
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    scene.fogDensity = 0.01;
    scene.fogStart = 15.0;
    scene.fogEnd = 60.0;
  }


  setBackground() {
    // this.skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 100.0 }, scene);
    // var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    // skyboxMaterial.backFaceCulling = false;
    // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/sky/skybox", scene);
    // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    // skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    // this.skybox.material = skyboxMaterial;

    this.skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 512.0 }, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/sky/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    this.skybox.material = skyboxMaterial;
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

}
// /** @type{BABYLON.Scene} */
// let scene2;
// let createScene2 = () => {
//   scene2 = new BABYLON.Scene(engine);
//   camera2 = new BABYLON.CAMERA("camera2", new )
// }