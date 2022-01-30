function createMaterial(scene, path) {
  var myMaterial = new BABYLON.StandardMaterial(path, scene);

  myMaterial.diffuseTexture = new BABYLON.Texture(path, scene);
  myMaterial.specularTexture = new BABYLON.Texture(path, scene);
  myMaterial.emissiveTexture = new BABYLON.Texture(path, scene);
  myMaterial.ambientTexture = new BABYLON.Texture(path, scene);

  return myMaterial;
}

function create_3d_shape(obj, img_path) {
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