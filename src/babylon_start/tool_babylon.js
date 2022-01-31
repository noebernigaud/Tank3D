function createMaterial(scene, path) {
  var myMaterial = new BABYLON.StandardMaterial(path, scene);

  myMaterial.diffuseTexture = new BABYLON.Texture(path, scene);
  myMaterial.specularTexture = new BABYLON.Texture(path, scene);
  myMaterial.emissiveTexture = new BABYLON.Texture(path, scene);
  myMaterial.ambientTexture = new BABYLON.Texture(path, scene);

  return myMaterial;
}

function create_3d_shape(obj, img_path) {
  if (obj instanceof Char)
    shape = BABYLON.MeshBuilder.CreateCylinder("char",
      { height: obj.sizex, diameter: obj.sizex }, scene);
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
  return shape
}

function place_object(obj) {
  obj.shape.position.y = cell_size / 2;
  obj.shape.position.x = -width / 2 + obj.x;
  obj.shape.position.z = height / 2 - cell_size / 2 - obj.y;
  if (obj === char1) {
    camera.position.x = obj.shape.position.x - 100 * Math.sin(camera.rotation.y);
    camera.position.y = obj.shape.position.y + 100;
    camera.position.z = obj.shape.position.z - 100 * Math.cos(camera.rotation.y);
  }
}

/**
 * @param {BABYLON.Mesh} obj
 * @returns {boolean} if obj touches another Mesh object
 */
function collision(obj) {
  let control = (elt) => elt !== obj && obj.shape.intersectsMesh(elt.shape);
  return (
    chars.some(control) ||
    walls.some(control) ||
    holes.some(control) ||
    bullets.some(control)
  )
}