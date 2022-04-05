class MoveAI {


  /**
   * @param {Char} tank 
   */
  static rotateTurret(tank) {
    var turret = tank.getTurretTank()

    var turretDir = turret.getDirection(new BABYLON.Vector3(1, 1, 1));
    var currentAngle = Math.atan2(turretDir.z, turretDir.x);
    var targetDir = char1.shape.position.subtract(tank.shape.position);
    var targetAngle = Math.atan2(targetDir.z, targetDir.x);
    tank.rotateTurretAxisY(currentAngle - targetAngle)
    tank.rotateTurretAxisY(Math.PI / 4)

    //char ennemi nous vise en hauteur:
    // var currentAngleY = turret.rotationQuaternion.toEulerAngles().x;
    // targetDir = char1.shape.position.subtract(tank.shape.position);
    // var targetAngleY = Math.atan2(targetDir.x, targetDir.y);
    // console.log("currentAngleY :", currentAngleY);
    // console.log("targetAngleY :", targetAngleY);
    // console.log(currentAngleY - targetAngleY);
    // // tank.rotateTurretUpDown((currentAngleY >= targetAngleY), Math.min(0.04, Math.abs(currentAngleY - targetAngleY)))
    // if (Math.abs(currentAngleY - targetAngleY) > 0.01 && (currentAngleY - targetAngleY) < 3.13) {
    //   tank.rotateTurretUpDown((currentAngleY <= targetAngleY), 0.01)
    // }
  }

  static rotateTankBody(tank) {
    var turretDir = tank.getTurretTank().getDirection(new BABYLON.Vector3(1, 1, 1));
    var currentAngle = Math.atan2(turretDir.z, turretDir.x);
    var targetDir = char1.shape.position.subtract(tank.shape.position);
    var targetAngle = Math.atan2(targetDir.z, targetDir.x);
    tank.rotate(BABYLON.Axis.Y, currentAngle - targetAngle);
    tank.rotate(BABYLON.Axis.Y, Math.PI / 4);
  }

  /**
   * @param {Char} tank 
   */
  static move(tank) {
    if (Math.random() < 0.02) {
      let randomRotation = (Math.random() - 0.5) / 10;
      tank.shape.rotate(BABYLON.Axis.Y, randomRotation);
    }
    tank.moveTankForeward();
    this.rotate(tank);
  }
}