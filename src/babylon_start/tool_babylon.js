x = 1;
function createMaterial(scene, path) {
  var myMaterial = new BABYLON.StandardMaterial(path, scene);

  myMaterial.diffuseTexture = new BABYLON.Texture(path, scene);
  myMaterial.specularTexture = new BABYLON.Texture(path, scene);
  myMaterial.emissiveTexture = new BABYLON.Texture(path, scene);
  myMaterial.ambientTexture = new BABYLON.Texture(path, scene);

  return myMaterial;
}

function create_3d_shape(obj, img_path) {
  /** @type {BABYLON.Mesh} */
  var shape;
  if (obj instanceof Char) {
    // shape = BABYLON.MeshBuilder.CreateCylinder("char",
    //   { height: obj.sizex, diameter: obj.sizex }, scene);
    shape = loadmodel();
    return shape;
  }
  else if (obj instanceof Mine)
    shape = BABYLON.MeshBuilder.CreateCylinder("mine",
      { diameter: obj.sizex, height: 3 }, scene);
  else if (obj instanceof Hole)
    shape = BABYLON.MeshBuilder.CreateCylinder("hole",
      { diameter: obj.sizex, height: 0 }, scene);
  else if (obj instanceof Bullet)
    shape = BABYLON.MeshBuilder.CreateSphere("hole",
      { diameter: obj.sizex * 2 }, scene);
  else
    shape = BABYLON.MeshBuilder.CreateBox("box",
      { height: obj.sizex, width: obj.sizex, depth: obj.sizex }, scene);

  shape.material = createMaterial(scene, img_path);

  shape.showBoundingBox = true;
  return shape
}

/**
 * @param {BABYLON.Mesh} obj
 * @returns {boolean} if obj touches another Mesh object
 */
function collision(obj) {
  let control = (elt) => elt !== obj && obj.intersectsMesh(elt);
  return (
    chars.some(control) ||
    walls.some(control) ||
    holes.some(control) ||
    bullets.some(control)
  )
}
async function loadmodel() {
  //return BABYLON.SceneLoader.ImportMesh("", "./models/", "tank.babylon", scene);
  var model = BABYLON.SceneLoader.ImportMesh("", "./models2/merkava_tank/", "scene.gltf", scene, (meshes) => {
    for (var i = 0; i < meshes.length; i++) {
      meshes[i].scaling = new BABYLON.Vector3(0.32, 0.32, 0.32);
    }
    x = meshes[0]
    x.position.x = 100
  });
  return x;

}