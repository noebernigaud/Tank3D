class guaranteedAI {

    /** @type {Char} */
    tank;
    constructor(tank) {
        this.tank = tank;
    }

    applyStrategy() {
        let target = ShootAI.targetPlayer(this.tank);
        if (char1.shape == target) {
            this.tank.addBullet(Date.now())
        }
    }
}