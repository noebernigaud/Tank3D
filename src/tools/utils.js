
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function createRay(origin, dir, length, disposeTime = 5) {
    let ray = new BABYLON.Ray(origin, dir, length);

    let pickInfo = scene.pickWithRay(ray, (mesh) => {
        return mesh;
    });
    if (pickInfo.pickedMesh) {
        let bounder = pickInfo.pickedMesh;
    }


    // let rayHelper = new BABYLON.RayHelper(ray);
    // rayHelper.show(scene, new BABYLON.Color3(1, 0, 0));
    // setTimeout(() => {
    //     rayHelper.dispose(ray);
    // }, disposeTime);

    return pickInfo.pickedMesh
}

var remove = (list, elt) => {
    var index = list.indexOf(elt)
    if (index !== -1) list.splice(index, 1)
}