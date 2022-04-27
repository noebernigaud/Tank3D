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
var groundSand;
var listGrounds = [];
var listSkyboxes = [];

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
    this.setFog()
    this.setBackground()
    this.setParticles()
    // this.setGizmo()
    this.setCamera()
    setCurrentLevelDico()

    ObjectEnum.initiate_all_models()
  }

  /**
   * @returns {BABYLON.Scene}
   */
  createScene() {
    scene = new BABYLON.Scene(this.engine);
    // engine.runRenderLoop(() => scene.render())

    hl = new BABYLON.HighlightLayer("hl", scene);

    hl.blurHorizontalSize = hl.blurVerticalSize = 0.3;

    hlBalls = new BABYLON.HighlightLayer("hlBalls", scene);

    hlBalls.blurHorizontalSize = hlBalls.blurVerticalSize = 0.001;

    scene.beforeRender = () => {

      if (!this.scene.menu.isShown) {
        scene.minimap.redraw()
        // char1.physicsImpostor.applyForce(new BABYLON.Vector3(0, -gravity * 30000, 0), char1.shape.position)
        bullets.forEach(bullet => bullet.physicsImpostor.applyForce(new BABYLON.Vector3(0, -gravity, 0), bullet.position))

        getAllMeshList(true).forEach(obj => {
          let outOfBound = (obj) => {
            return obj.position && (
              obj.position.x <= width / 2 - 100 ||
              obj.position.x >= width / 2 + 100 ||
              obj.position.z <= height / 2 - 100 ||
              obj.position.z >= height / 2 + 100 ||
              obj.position.y < current_level_dico.minHeightMap - 0.8 ||
              obj.position.y >= +8)
          }
          if (outOfBound(obj.shape) || outOfBound(obj)) {
            obj.dispose(true, true)
          }
        })
        let velocity = char1.physicsImpostor.getLinearVelocity()
        let speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2) * 10
        document.getElementById("speed").innerHTML = Math.round(speed) + " km/h"

        // let posChar1 = char1.shape.position

        chars.forEach(c => {

          //le char prend des degats si il est retourné
          if (c.isRenversed()) c.healthLoss(c.maxHealth / 120)

          //update barre de vie
          c.healtBar.updatePartition()

          //réglage son de déplacement selon la vitesse
          let velocityc = c.physicsImpostor.getLinearVelocity()
          let speedc = Math.sqrt(velocityc.x ** 2 + velocityc.y ** 2 + velocityc.z ** 2) * 10
          c.moveSound.volume = Math.max(Math.min(1, 0.01 * speedc), 0.2)

          //réglage son de déplacement selon la distance
          playSoundWithDistanceEffect(c.moveSound, c.shape, false, false)
        })

        // charsAI.forEach(c => MoveAI.move(c));
        // if (tanksAIReady) charsAI.forEach(c => c.strategy.applyMovement())
        anime()


        //VERIFICATION TOUS CHARS ENNEMIS ELIMINES

        charsAI.forEach(c => {
          if (c.life <= 0) {
            console.log("should destroy char ", c);
            let index = chars.indexOf(c)
            if (index !== -1) chars.splice(index, 1)
            index = charsAI.indexOf(c)
            if (index !== -1) charsAI.splice(index, 1)
            c.destroyTank()
            // c.dispose(true)
          }
        })
        if (char1.life <= 0 || level == level_map.length) {
          // this.scene.menu.restart()
          current_level_dico.goNextLevel(lvlStatus.DIE)
          // level = 0;
          // remove_all_objects(true)
          // startgame(level);
          // this.scene.menu.createButton()
        } else if (current_level_dico.canGoNextLevel()) {
          if (level + 1 == level_map.length) {
            // this.scene.menu.restart()
            current_level_dico.goNextLevel(lvlStatus.WIN)
          } else if (!this.scene.menu.inOtherMenu()) {
            current_level_dico.goNextLevel()
            if (sceneInterval) {
              clearInterval(sceneInterval)
            }
            // startTimer()
          }
        }

        else {
          charsAI.forEach(c => c.strategy.applyStrategy());
          chars.forEach(c => SpecialBonus.updateAllThankBonuses(c));
        }// TODO : Here update all bonuses list !!!
        //charsAI.forEach(c => MoveAI.move(c));

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
    camera = new BABYLON.FollowCamera("tankCamera", ground.position, scene, ground);
    // camera.attachControl(canvas, true);
    camera.radius = 40;
    camera.heightOffset = 14;
    camera.rotationOffset = 50;
    camera.cameraAcceleration = .1;
    camera.maxCameraSpeed = 10;

  }

  setGround() {
    // const groundOptions = {
    //   width: width * 1.5 + cell_size,
    //   height: height * 1.5 + cell_size,
    //   subdivisions: 80,
    //   minHeight: current_level_dico.minHeightMap,
    //   maxHeight: 0,

    //   onReady: () => onGroundCreated(this),
    // };
    //scene is optional and defaults to the current scene

    let groundOptions = (name, index) => {
      return {
        width: width * 1.5 + cell_size,
        height: height * 1.5 + cell_size,
        subdivisions: 80,
        minHeight: current_level_dico.minHeightMap,
        maxHeight: 0,

        onReady: () => onGroundCreated(this, name, index),
      }
    }

    listGrounds.push(BABYLON.MeshBuilder.CreateGroundFromHeightMap(
      "gdhm",
      `textures/earthy_ground.png`,
      groundOptions("earthy", 0),
      scene
    ));
    listGrounds.push(BABYLON.MeshBuilder.CreateGroundFromHeightMap(
      "gdhm",
      `textures/sandy_ground.png`,
      groundOptions("sandy", 1),
      scene
    ));
    listGrounds.push(BABYLON.MeshBuilder.CreateGroundFromHeightMap(
      "gdhm",
      `textures/snowy_ground.png`,
      groundOptions("snowy", 2),
      scene
    ));

    function onGroundCreated(myScene, name, index) {
      const groundMaterial = new BABYLON.StandardMaterial(
        "groundMaterial",
        scene
      );
      groundMaterial.diffuseTexture = new BABYLON.Texture(`textures/${name}_ground_diffuse.png`, scene, null, true, null, function () {
        ObjectEnum.loadingDone();
      });
      listGrounds[index].material = groundMaterial;

      listGrounds[index].receiveShadows = false
      // to be taken into account by collision detection
      //groundMaterial.wireframe=true;

      // for physic engine
      // listGrounds[index].physicsImpostor = new BABYLON.PhysicsImpostor(
      //   listGrounds[index],
      //   BABYLON.PhysicsImpostor.HeightmapImpostor,
      //   { mass: 0 },
      //   scene
      // );


      groundMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9)
      groundMaterial.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3)
      groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0)

      myScene.setWater(listGrounds[index]);

      listGrounds[index].position.y = -10

    }
    ground = listGrounds[1]

    return ground;
  }

  setWater(gr) {
    //sand ground
    var groundTexture = new BABYLON.Texture("textures/sand.jpg", scene);
    groundTexture.vScale = groundTexture.uScale = 4.0;

    var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = groundTexture;

    groundSand = BABYLON.MeshBuilder.CreateGround("groundSand", { height: 128, width: 128, subdivisions: 32 }, scene);
    groundSand.position.y = gr.position.y - 0.1
    groundSand.material = groundMaterial;
    groundSand.physicsImpostor = new BABYLON.PhysicsImpostor(
      groundSand,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      scene
    );
    var collidedChar
    groundSand.physicsImpostor.onCollideEvent = (e1, e2) => {
      if (collidedChar = chars.find(e => e.shape == e2.object)) {
        console.log("char collided ", collidedChar)
        console.log("health ", collidedChar.health)
        collidedChar.healthLoss(1)
        console.log("health ", collidedChar.health)
      }
    }


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

    listSkyboxes.forEach(s => water.addToRenderList(s))
    water.addToRenderList(groundSand);
    waterMesh.material = water;
  }

  setShadow() {

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
    if (biome != "Snow") return;
    // scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    //BABYLON.Scene.FOGMODE_NONE;
    //BABYLON.Scene.FOGMODE_EXP2;
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogColor = new BABYLON.Color3(1, 1, 1);
    scene.fogDensity = 0.3;
    scene.fogStart = 0.1;
    scene.fogEnd = 30.0;
  }


  setBackground() {

    let createSkybox = (name) => {
      let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 512.0 }, scene);
      let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(`images/${name}_sky/skybox`, scene);
      skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
      skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
      skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
      skyboxMaterial.disableLighting = true;
      skybox.material = skyboxMaterial;
      skybox.isVisible = false
      return skybox
    }

    listSkyboxes.push(createSkybox("cloudy"))
    listSkyboxes.push(createSkybox("sunny"))


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