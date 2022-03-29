class MoveAI {


  /**
   * @param {Char} tank 
   */
  static rotateTurret(tank) {
    //tank.getTurretTank().setDirection(char1.shape.position.subtract(tank.shape.position));
    var turretDir = tank.getTurretTank().getDirection(new BABYLON.Vector3(1, 1, 1));
    var currentAngle = Math.atan2(turretDir.z, turretDir.x);
    var targetDir = char1.shape.position.subtract(tank.shape.position);
    var targetAngle = Math.atan2(targetDir.z, targetDir.x);
    tank.getTurretTank().rotate(BABYLON.Axis.Y, currentAngle - targetAngle);
    tank.getTurretTank().rotate(BABYLON.Axis.Y, Math.PI / 4);
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