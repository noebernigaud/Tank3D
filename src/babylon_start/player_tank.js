function rotateAxisY(angle) {
    tankContainer.rotate(new BABYLON.Vector3(0, 1, 0), angle)
    rotateTurretAxisY(-angle)
    tankContainer.rotation.y += angle
}

function rotateTurretAxisY(angle) {
    tanksMeshes[4].rotate(new BABYLON.Vector3(0, 1, 0), angle)
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