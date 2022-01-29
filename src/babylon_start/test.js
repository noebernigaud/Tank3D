/// <reference path="babylon.d.ts" />

function createMaterial(scene, path) {
  var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);

  myMaterial.diffuseTexture = new BABYLON.Texture(path, scene);
  myMaterial.specularTexture = new BABYLON.Texture(path, scene);
  myMaterial.emissiveTexture = new BABYLON.Texture(path, scene);
  myMaterial.ambientTexture = new BABYLON.Texture(path, scene);

  return myMaterial;
}

var canvas = document.getElementById("myCanvas");

var startRenderLoop = function (engine, canvas) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
}


/** @type {BABYLON.Mesh} */
var sphere;

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };
var createScene = function () {
  // This creates a basic Babylon Scene object (non-mesh)
  var scene = new BABYLON.Scene(engine);

  // This creates and positions a free camera (non-mesh)
  camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 385, -796), scene);

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'sphere' shape.
  sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: cell_size, segments: 32 }, scene);

  // Move the sphere upward 1/2 its height
  sphere.position.y = cell_size / 2;

  // Our built-in 'ground' shape.
  var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: width, height: height }, scene);
  ground.material = createMaterial(scene, 'images/woodTexture.jpg')

  print = console.log
  for (var i = 0; i < cell_x_number; i++) {
    for (var j = 0; j < cell_y_number; j++) {
      if (i == 0 || i == cell_x_number - 1 || j == 0 || j == cell_y_number - 1) {
        var box = BABYLON.MeshBuilder.CreateBox("box", { height: cell_size, width: cell_size, depth: cell_size }, scene);

        material = createMaterial(scene, 'images/wallTexture.jpg');

        box.position.y = cell_size / 2;
        box.position.x = -width / 2 + cell_size / 2 + cell_size * i;
        box.position.z = -height / 2 + cell_size / 2 + cell_size * j;
        box.material = material
      }
    }
  }
  return scene;
};
window.initFunction = async function () {


  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log("the available createEngine function failed. Creating the default engine instead");
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


window.addEventListener('keydown', (evt) => {
  /** @type {BABYLON.Vector3} */
  var pos = sphere.position;
  if (evt.code === "Space") {
    inputStates.SPACE = true;
  }
  if (evt.code === "KeyA") {
    pos.x -= 10
  }
  if (evt.code === "KeyW") {
    pos.z += 10
  }
  if (evt.code === "KeyS") {
    pos.z -= 10
  }
  if (evt.code === "KeyD") {
    pos.x += 10
  }
});
