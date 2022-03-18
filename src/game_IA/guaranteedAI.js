class guaranteedAI {

    /** @type {Char} */
    tank;
    intervalStratShoot;
    constructor(tank) {
        this.tank = tank;
    }

    applyStrategy() {
        this.intervalStratShoot = setInterval(() => {

            if (char1.shape == ShootAI.targetPlayer(this.tank)) {
                this.tank.addBullet(Date.now())
            }
        }, 200);
    }

    applyMovement() {
        MoveAI.rotate(this.tank)
    }

}