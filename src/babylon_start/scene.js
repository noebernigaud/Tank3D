/// <reference path="babylon.d.ts" />

var canvas = document.getElementById("myCanvas");
var ground;
var lightCam;
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
var light1;

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
  }

  /**
   * @returns {BABYLON.Scene}
   */
  createScene() {
    scene = new BABYLON.Scene(this.engine);
    // engine.runRenderLoop(() => scene.render())


    scene.beforeRender = () => {
      if (!this.scene.menu.isShown) {
        scene.minimap.redraw()
        // char1.physicsImpostor.applyForce(new BABYLON.Vector3(0, -gravity * 30000, 0), char1.shape.position)
        bullets.forEach(bullet => bullet.physicsImpostor.applyForce(new BABYLON.Vector3(0, -gravity, 0), bullet.position))

        getAllMeshList().forEach(obj => {
          if (obj.shape.position.x <= width / 2 - 100 ||
            obj.shape.position.x >= width / 2 + 100 ||
            obj.shape.position.z <= height / 2 - 100 ||
            obj.shape.position.z >= height / 2 + 100 ||
            obj.shape.position.y < current_level_dico.minHeightMap - 0.8 ||
            obj.shape.position.y >= +8) {
            obj.dispose(true, true)
          }
        })
        let velocity = char1.physicsImpostor.getLinearVelocity()
        let speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2) * 10
        document.getElementById("speed").innerHTML = Math.round(speed) + " km/h"

        let posChar1 = char1.shape.position

        chars.forEach(c => {
          if (c.shape.position.y < ground.position.y - 5) {
            c.life = 0;
          }
          c.healtBar.updatePartition()

          let velocityc = c.physicsImpostor.getLinearVelocity()
          let speedc = Math.sqrt(velocityc.x ** 2 + velocityc.y ** 2 + velocityc.z ** 2) * 10
          c.mouveSound.volume = Math.max(Math.min(1, 0.01 * speedc), 0.2)
          // c.mouveSound.volume = Math.min(1, 0.01 * speedc)

          let posc = c.shape.position
          let distanceCtoChar1 = Math.sqrt((posc.x - posChar1.x) ** 2 + (posc.y - posChar1.y) ** 2 + (posc.z - posChar1.z) ** 2)
          console.log(distanceCtoChar1);
          c.mouveSound.volume *= 1 / (Math.max(1, distanceCtoChar1) ** 0.5)
        })
        // charsAI.forEach(c => MoveAI.move(c));
        // if (tanksAIReady) charsAI.forEach(c => c.strategy.applyMovement())
        anime()
        //VERIFICATION TOUS CHARS ENNEMIS ELIMINES

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
        } else if (charsAI.length == 0) {
          if (level + 1 == level_map.length)
            this.scene.menu.restart()
          else {
            startTimer()
          }
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
      minHeight: current_level_dico.minHeightMap,
      maxHeight: 0,
      onReady: () => onGroundCreated(this),
    };
    //scene is optional and defaults to the current scene
    ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
      "gdhm",
      "textures/ground3.png",
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
      groundMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9)
      groundMaterial.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3)
      groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0)

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
    groundSand.position.y = gr.position.y - 0.1
    groundSand.material = groundMaterial;

    //water ground
    var waterMesh = BABYLON.MeshBuilder.CreateGround("waterMesh", { height: 256, width: 256, subdivisions: 32 }, scene);
    waterMesh.position.y = gr.position.y - 0.1
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
    // var light = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(25, -25, 0), scene);
    // light.intensity = 0;
    // light.position = new BABYLON.Vector3(0, 100, 0);

    light1 = new BABYLON.PointLight("spotLight1", new BABYLON.Vector3(0, 10, 0), scene);
    light1.emissive = new BABYLON.Color3(0, 0, 0);
    light1.specular = new BABYLON.Color3(0.2, 0.2, 0.2);

    light1.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
    light1.intensity = 3

    shadowGenerator = new BABYLON.ShadowGenerator(256, light1)
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurScale = 1;
    shadowGenerator.setDarkness(0.1);
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
