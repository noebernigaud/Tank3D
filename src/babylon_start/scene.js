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

    ground = BABYLON.MeshBuilder.CreateGround("ground", { width: width + cell_size, height: height + cell_size }, scene);
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
  tankContainer.rotate(new BABYLON.Vector3(0, 1, 0), angle)
  tankContainer.rotation.y += angle
  //tanksMeshes.forEach(e => e.rotate(new BABYLON.Vector3(0, 1, 0), angle))
}

function rotateTurretAxisY(angle) {
  tanksMeshes[4].rotate(new BABYLON.Vector3(0, 1, 0), angle)
}

function moveTankForeward(speed) {
  tankContainer.physicsImpostor.setLinearVelocity(
    new BABYLON.Vector3(
      speed * Math.sin(tankContainer.rotation.y),
      0,
      speed * Math.cos(tankContainer.rotation.y)))
  tankContainer.position.y = 12.501
  // tanksMeshes.forEach(e => e.physicsImpostor.setLinearVelocity(
  //   new BABYLON.Vector3(
  //     speed * Math.sin(e.rotation.y),
  //     0,
  //     speed * Math.cos(e.rotation.y))))
}

function moveTankBackward(speed) {
  tankContainer.physicsImpostor.setLinearVelocity(
    new BABYLON.Vector3(
      -speed * Math.sin(tankContainer.rotation.y),
      0,
      -speed * Math.cos(tankContainer.rotation.y)))
  // tanksMeshes.forEach(e => e.physicsImpostor.setLinearVelocity(
  //   new BABYLON.Vector3(
  //     -speed * Math.sin(e.rotation.y),
  //     0,
  //     -speed * Math.cos(e.rotation.y))))
}

function stabilizeTank() {
  if (typeof tankContainer !== 'undefined') {
    tankContainer.physicsImpostor.setLinearVelocity(
      new BABYLON.Vector3(0, 0, 0));
    tankContainer.physicsImpostor.setAngularVelocity(
      new BABYLON.Vector3(0, 0, 0))
  }

}