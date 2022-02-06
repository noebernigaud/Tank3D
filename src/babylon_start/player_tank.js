async function addTank() {
    model = await BABYLON.SceneLoader.ImportMeshAsync("", "./models/", "tank.babylon").then((meshes) => {
        tankMeshes = [
            scene.getMeshById('Body_1'),
            scene.getMeshById('Body_2'),
            scene.getMeshById('Track'),
            scene.getMeshById('Turret'),
            scene.getMeshById('Turret_2'),
            scene.getMeshById('LightPreset'),
        ]

        tankMeshes.forEach(x => x.scaling = new BABYLON.Vector3(10, 10, 10));

        //defineBoundingBox(tanksMeshes);

        tankContainer = BABYLON.MeshBuilder.CreateBox("Box", { height: 25, width: 38, depth: 70 }, scene);
        tankContainer.position.y += 12.70;
        tankMeshes.forEach(e => tankContainer.addChild(e));
        tankContainer.physicsImpostor = new BABYLON.PhysicsImpostor(tankContainer, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1000, restitution: 0 })
        //tankContainer.isVisible = false;
        tankContainer.visibility = 0.000001;
        tankContainer.showBoundingBox = true;
        // tanksMeshes.forEach(e => e.physicsImpostor = new BABYLON.PhysicsImpostor(e, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0, pressure: 0 }));

        camera.target = tankMeshes[4];

    });
}

function rotateAxisY(angle) {
    tankContainer.rotate(new BABYLON.Vector3(0, 1, 0), angle)
    rotateTurretAxisY(-angle)
    tankContainer.rotation.y += angle
}

function rotateTurretAxisY(angle) {
    tankMeshes[4].rotate(new BABYLON.Vector3(0, 1, 0), angle)
}

function moveTankForeward() {
    var speed = 100
    moveTank(speed)
}

function moveTankBackward() {
    var speed = -50
    moveTank(speed)
}

function moveTank(speed) {
    let frontVec = tankContainer.getDirection(new BABYLON.Vector3(0, 0, 1))
    let moveVec = frontVec.scale(speed)
    let realVec = new BABYLON.Vector3(moveVec.x, 0, moveVec.z)
    tankContainer.physicsImpostor.setLinearVelocity(realVec)

}

function stabilizeTank() {
    tankContainer.physicsImpostor.setLinearVelocity(
        new BABYLON.Vector3(0, 0, 0));
    tankContainer.physicsImpostor.setAngularVelocity(
        new BABYLON.Vector3(0, 0, 0))
}

function destroyTank(isDisabled) {
    if (isDisabled) {
        explode(tankContainer)
        tankMeshes.forEach(e => e.setParent(null))
        tankMeshes.forEach(e => e.physicsImpostor = new BABYLON.PhysicsImpostor(e, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }));

        tankContainer.dispose()
    }
}