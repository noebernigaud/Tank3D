class MoveAI {


  /**
   * @param {Char} tank 
   */
  static rotateTurret(tank) {
    var turret = tank.getTurretTank()

    //char ennemi nous vise en x et z
    var turretDir = turret.getDirection(new BABYLON.Vector3(1, 1, 1));
    var currentAngle = Math.atan2(turretDir.z, turretDir.x);
    var targetDir = char1.shape.position.subtract(tank.shape.position);
    var targetAngle = Math.atan2(targetDir.z, targetDir.x);
    var rota = ((currentAngle - targetAngle) + Math.PI / 4)
    if (rota > Math.PI) rota -= 2 * Math.PI
    if (rota > 0) tank.rotateTurretAxisY(Math.min(0.05, rota))
    if (rota < 0) tank.rotateTurretAxisY(Math.max(-0.05, rota))

    //char ennemi nous vise en hauteur:
    var currentAngleY = turret.getDirection(BABYLON.Axis.Z).y;
    targetDir = BABYLON.Vector3.Normalize(char1.shape.position.subtract(tank.shape.position));
    let dotVec = BABYLON.Vector3.Dot(new BABYLON.Vector3(0, -1, 0), targetDir);
    let targetAngleY = Math.acos(dotVec) - Math.PI / 2;
    // console.log("currentAngleY :", currentAngleY);
    // console.log("targetAngleY :", targetAngleY);
    // console.log(currentAngleY <= targetAngleY);
    tank.rotateTurretUpDown((currentAngleY <= targetAngleY), 1)
  }

  static rotateTankBody(tank) {
    var turretDir = tank.getTurretTank().getDirection(new BABYLON.Vector3(1, 1, 1));
    var currentAngle = Math.atan2(turretDir.z, turretDir.x);
    var targetDir = char1.shape.position.subtract(tank.shape.position);
    var targetAngle = Math.atan2(targetDir.z, targetDir.x);
    tank.rotate(BABYLON.Axis.Y, currentAngle - targetAngle + Math.PI / 4);
    // tank.rotate(BABYLON.Axis.Y, Math.PI / 4);
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