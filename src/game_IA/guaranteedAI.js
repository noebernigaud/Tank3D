class guaranteedAI {

    /** @type {Char} */
    tank;

    angleChange;

    constructor(tank) {
        this.tank = tank;
        this.updateTir = 12;
        this.updateDir = 10;
        this.angleChange = 0;
    }

    applyStrategy() {

        // Move tank
        if (this.updateDir <= 0) {
            this.angleChange = Math.random() * 0.05 - 0.025;
            this.updateDir = Math.round(Math.random() * 120) + 50;
            if (Math.random() > 0.5) this.angleChange = 0;
        }
        this.updateDir--;

        this.tank.shape.rotate(BABYLON.Axis.Y, this.angleChange);

        this.tank.moveTankForeward();

        //Rotate turret
        MoveAI.rotateTurret(this.tank);

        // Shoot simulation
        if (this.updateTir <= 0) {
            if (char1.shape == ShootAI.targetPlayer(this.tank)) {
                // this.tank.addBullet(Date.now())
            }
            this.updateTir = 12;
        }
        this.updateTir--;
    }
}