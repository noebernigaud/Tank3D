/// <reference path="babylon.d.ts" />

var canvas = document.getElementById("myCanvas");
var tanksMeshes;
var model;
var tankContainer;
var ground;

class Scene {

  constructor() {
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = this.createScene();

    this.engine.runRenderLoop(() =>
      this.scene.render()
    );

    this.setBackground()
    this.addTank()
    this.setUpExplosion()
    init()
  }

  /**
   * @returns {BABYLON.Scene}
   */
  createScene() {
    scene = new BABYLON.Scene(this.engine);

    //camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 100, -110), scene);

    camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(0, 100, -110));
    camera.angularSensibilityX = 250
    camera.angularSensibilityY = 250
    camera.inertia = 0

    camera.attachControl(canvas, true);

    camera.inputs.attached.keyboard.detachControl();
    // camera.inputs.clear();
    // camera.inputs.addGamepad()

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    light.intensity = 0.5;

    var gravityVector = new BABYLON.Vector3(0, 0, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);

    ground = BABYLON.MeshBuilder.CreateGround("ground", { width: width + cell_size, height: height + cell_size }, scene);
    ground.material = createMaterial(scene, 'images/woodTexture.jpg')
    ground.checkCollisions = true;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 5 });
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
    model = await BABYLON.SceneLoader.ImportMeshAsync("", "./models/", "tank.babylon").then((meshes) => {
      tanksMeshes = [
        scene.getMeshById('Body_1'),
        scene.getMeshById('Body_2'),
        scene.getMeshById('Track'),
        scene.getMeshById('Turret'),
        scene.getMeshById('Turret_2'),
        scene.getMeshById('LightPreset'),
      ]

      tanksMeshes.forEach(x => x.scaling = new BABYLON.Vector3(10, 10, 10));
      //tanksMeshes.forEach(e => e.position.x += 100);


      //defineBoundingBox(tanksMeshes);

      tankContainer = BABYLON.MeshBuilder.CreateBox("Box", { height: 25, width: 38, depth: 70 }, scene);

      //tankContainer = BABYLON.Mesh.MergeMeshes(tanksMeshes, true, true, undefined, true)

      tankContainer.position.x += 0
      tankContainer.position.y += 13
      tankContainer.position.z += 0
      tanksMeshes.forEach(e => tankContainer.addChild(e))
      tankContainer.physicsImpostor = new BABYLON.PhysicsImpostor(tankContainer, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1000, restitution: 0 })
      //tankContainer.isVisible = false;
      tankContainer.visibility = 0.000001
      tankContainer.showBoundingBox = true;
      // tanksMeshes.forEach(e => e.physicsImpostor = new BABYLON.PhysicsImpostor(e, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0, pressure: 0 }));

      camera.target = tanksMeshes[0]

    });
  }

  setUpExplosion() {
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

function explode(event) {
  if (event === "KeyA") {
    BABYLON.ParticleHelper.CreateAsync("explosion", scene).then((set) => {
      set.systems.forEach(s => {
        s.disposeOnStop = true;
      });

      for (const sys of set.systems) {
        sys.worldOffset = new BABYLON.Vector3(tankContainer.position.x, tankContainer.position.y, tankContainer.position.z);
        sys.maxScaleX = 6;
        sys.maxScaleY = 6;
      }
      set.start();

    });
  }
}

function smoke() {
  var ph = BABYLON.ParticleHelper.CreateAsync("smoke", scene).then((set) => {
    for (const sys of set.systems) {
      sys.worldOffset = new BABYLON.Vector3(tankContainer.position.x, tankContainer.position.y, tankContainer.position.z);
      sys.maxScaleX = 6;
      sys.maxScaleY = 6;
    }
    set.start();
  });
  ph.emitter = tankContainer
}

function createSmoke(emitter) {
  // Create a particle system
  var particleSystem = new BABYLON.ParticleSystem("particles", 8000);

  //Texture of each particle
  particleSystem.particleTexture = new BABYLON.Texture("textures/smoke.png");

  // lifetime
  particleSystem.minLifeTime = 2;
  particleSystem.maxLifeTime = 5;

  // emit rate
  particleSystem.emitRate = 100;

  // gravity
  particleSystem.gravity = new BABYLON.Vector3(0.25, 9.5, 0);

  // size gradient
  particleSystem.addSizeGradient(0, 0.6, 1);
  particleSystem.addSizeGradient(0.3, 1, 2);
  particleSystem.addSizeGradient(0.5, 2, 3);
  particleSystem.addSizeGradient(1.0, 6, 8);

  // color gradient
  particleSystem.addColorGradient(0, new BABYLON.Color4(0.5, 0.5, 0.5, 0), new BABYLON.Color4(0.8, 0.8, 0.8, 0));
  particleSystem.addColorGradient(0.4, new BABYLON.Color4(0.1, 0.1, 0.1, 0.1), new BABYLON.Color4(0.4, 0.4, 0.4, 0.4));
  particleSystem.addColorGradient(0.7, new BABYLON.Color4(0.03, 0.03, 0.03, 0.2), new BABYLON.Color4(0.3, 0.3, 0.3, 0.4));
  particleSystem.addColorGradient(1.0, new BABYLON.Color4(0.0, 0.0, 0.0, 0), new BABYLON.Color4(0.03, 0.03, 0.03, 0));

  // speed gradient
  particleSystem.addVelocityGradient(0, 1, 1.5);
  particleSystem.addVelocityGradient(0.1, 0.8, 0.9);
  particleSystem.addVelocityGradient(0.7, 0.4, 0.5);
  particleSystem.addVelocityGradient(1, 0.1, 0.2);

  // rotation
  particleSystem.minInitialRotation = 0;
  particleSystem.maxInitialRotation = Math.PI;
  particleSystem.minAngularSpeed = -1;
  particleSystem.maxAngularSpeed = 1;

  // size
  particleSystem.minSize = 15;
  particleSystem.maxSize = 25;

  // blendmode
  particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;

  // emitter shape
  var sphereEmitter = particleSystem.createSphereEmitter(0.1);

  // Where the particles come from
  particleSystem.emitter = emitter; // the starting object
  particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
  particleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5);

  return particleSystem;
}

function playSmoke(particleSystem) {
  particleSystem.start();
}

function stopSmoke(particleSystem) {
  particleSystem.stop();
}



function defineBoundingBox(eltList) {
  let childMeshes = eltList;
  let min = childMeshes[0].getBoundingInfo().boundingBox.minimumWorld;
  let max = childMeshes[0].getBoundingInfo().boundingBox.maximumWorld;
  for (let i = 0; i < childMeshes.length; i++) {
    let meshMin = childMeshes[i].getBoundingInfo().boundingBox.minimumWorld;
    let meshMax = childMeshes[i].getBoundingInfo().boundingBox.maximumWorld;

    min = BABYLON.Vector3.Minimize(min, meshMin);
    max = BABYLON.Vector3.Maximize(max, meshMax);
  }
  let newBoundingBox = new BABYLON.BoundingInfo(min, max)
  eltList[0].setBoundingInfo(newBoundingBox);
  eltList[0].showBoundingBox = true;
}

function rotateAxisY(angle) {

  if (typeof tankContainer !== 'undefined') {
    tankContainer.rotate(new BABYLON.Vector3(0, 1, 0), angle)
    rotateTurretAxisY(-angle)
    tankContainer.rotation.y += angle
  }
}

function rotateTurretAxisY(angle) {
  if (typeof tankContainer !== 'undefined') {
    tanksMeshes[4].rotate(new BABYLON.Vector3(0, 1, 0), angle)
  }
}

function moveTankForeward() {
  var speed = 100
  if (typeof tankContainer !== 'undefined') {
    // let oldVel = tankContainer.physicsImpostor.getLinearVelocity()
    // let v = oldVel

    let frontVec = tankContainer.getDirection(new BABYLON.Vector3(0, 0, 1))
    let fVec = frontVec.scale(speed)
    let fMoveVec = new BABYLON.Vector3(fVec.x, 0, fVec.z)
    //console.log("before: ", frontVec.x, tankContainer.rotation.y);
    //v.addInPlace(new BABYLON.Vector3(fMoveVec.x, 0, fMoveVec.z))
    //tankContainer.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(fMoveVec.x, oldVel.y, fMoveVec.z))
    //let vel = BABYLON.Vector3.Clamp(v, new BABYLON.Vector3(-speed, 0, -speed), new BABYLON.Vector3(speed, 0, speed))
    tankContainer.physicsImpostor.setLinearVelocity(fMoveVec)
    let frontVec2 = tankContainer.getDirection(new BABYLON.Vector3(0, 0, 1))
    // console.log("after: ", frontVec2.x, tankContainer.rotation.y);

    // tankContainer.physicsImpostor.setLinearVelocity(
    //   new BABYLON.Vector3(
    //     speed * Math.sin(tankContainer.rotation.y),
    //     0,
    //     speed * Math.cos(tankContainer.rotation.y)))
    //tankContainer.position.y = 12.51
  }
}

function moveTankBackward() {
  var speed = -50
  if (typeof tankContainer !== 'undefined') {
    // let oldVel = tankContainer.physicsImpostor.getLinearVelocity()
    // let v = oldVel

    let frontVec = tankContainer.getDirection(new BABYLON.Vector3(0, 0, 1))
    let fVec = frontVec.scale(speed)
    let fMoveVec = new BABYLON.Vector3(fVec.x, 0, fVec.z)
    //console.log("before: ", frontVec.x, tankContainer.rotation.y);
    //v.addInPlace(new BABYLON.Vector3(fMoveVec.x, 0, fMoveVec.z))
    //tankContainer.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(fMoveVec.x, oldVel.y, fMoveVec.z))
    //let vel = BABYLON.Vector3.Clamp(v, new BABYLON.Vector3(-speed, 0, -speed), new BABYLON.Vector3(speed, 0, speed))
    tankContainer.physicsImpostor.setLinearVelocity(fMoveVec)
    let frontVec2 = tankContainer.getDirection(new BABYLON.Vector3(0, 0, 1))
    // if (typeof tankContainer !== 'undefined') {
    //   tankContainer.physicsImpostor.setLinearVelocity(
    //     new BABYLON.Vector3(
    //       -speed * Math.sin(tankContainer.rotation.y),
    //       0,
    //       -speed * Math.cos(tankContainer.rotation.y)))
  }
}

function stabilizeTank() {
  if (typeof tankContainer !== 'undefined') {
    tankContainer.physicsImpostor.setLinearVelocity(
      new BABYLON.Vector3(0, 0, 0));
    tankContainer.physicsImpostor.setAngularVelocity(
      new BABYLON.Vector3(0, 0, 0))
  }

}