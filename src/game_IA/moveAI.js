class MoveAI {


  /**
   * @param {Char} tank 
   */
  static rotate(tank) {
    tank.getTurretTank().setDirection(char1.shape.position.subtract(tank.shape.position));
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