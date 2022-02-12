function rotateAxisY(angle) {
    tankContainer.rotate(BABYLON.Axis.Y, angle)
    rotateTurretAxisY(-angle)
}

function rotateTurretAxisY(angle) {
    tankMeshes[1].rotate(BABYLON.Axis.Y, angle)
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
    tankContainer.physicsImpostor.setAngularVelocity(
        new BABYLON.Vector3(0, 0, 0))
    let frontVec = tankContainer.getDirection(BABYLON.Axis.Z)
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

function getTurretTank() {
    return tankMeshes[1];
}