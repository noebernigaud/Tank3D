class guaranteedAI {

    /** @type {Char} */
    tank;

    angleChange;

    constructor(tank) {
        this.tank = tank;
        this.updateTir = 12;
        this.updateDir = 10;
        this.angleChange = 0;
        this.goRight = 0;
    }

    applyStrategy() {

        var dirZ = this.tank.shape.getDirection(BABYLON.Axis.Z);
        var dirX = this.tank.shape.getDirection(BABYLON.Axis.X);

        // Move tank
        var objAhead = createRay(new BABYLON.Vector3(
            this.tank.shape.position.x + dirZ.x,
            this.tank.shape.position.y + 3 / 40,
            this.tank.shape.position.z + dirX.x),
            dirZ, 3);
        let right = Math.atan2(dirX.x, dirZ.x) + Math.PI / 2;
        let left = Math.atan2(dirX.x, dirZ.x) - Math.PI / 2;
        var objLeft = createRay(new BABYLON.Vector3(
            this.tank.shape.position.x + dirZ.x + Math.cos(left) * 0.6,
            this.tank.shape.position.y + 3 / 40,
            this.tank.shape.position.z + dirX.x + Math.sin(left) * 0.6),
            new BABYLON.Vector3(Math.cos(left), dirZ.y, Math.sin(left)), 3);
        var objRight = createRay(new BABYLON.Vector3(
            this.tank.shape.position.x + dirZ.x + Math.cos(right) * 0.6,
            this.tank.shape.position.y + 3 / 40,
            this.tank.shape.position.z + dirX.x + Math.sin(right) * 0.6),
            new BABYLON.Vector3(Math.cos(right), dirZ.y, Math.sin(right)), 3);

        if (!objAhead) {
            if (this.updateDir <= 0) {
                if ((!objRight && !objLeft) || (objRight && objLeft)) { this.goRight = Math.random() > 0.5 ? -1 : 1; }
                else this.goRight = objRight != null ? 1 : -1;
                this.angleChange = (Math.random()) * 0.03 * this.goRight;
                this.updateDir = Math.round(Math.random() * 120) + 50;
                if (Math.random() > 0.3) this.angleChange = 0;
            }
            this.goRight = 0
        } else {
            if (this.goRight == 0) {
                if ((!objRight && !objLeft) || (objRight && objLeft)) { this.goRight = Math.random() > 0.5 ? -1 : 1; }
                else this.goRight = objRight != null ? 1 : -1;
            }
            this.angleChange = 0.02 * this.goRight
        }


        this.updateDir--;

        this.tank.shape.rotate(BABYLON.Axis.Y, this.angleChange * 1.5);

        var delimAhead = createRay(new BABYLON.Vector3(
            this.tank.shape.position.x + dirZ.x,
            this.tank.shape.position.y + 3 / 40,
            this.tank.shape.position.z + dirX.x),
            dirZ, 2);
        // if (!delimAhead)
        //     this.tank.moveTankForeward();
        // else
        //     if (delimAhead.name != "delimiter")
        //         this.tank.moveTankForeward();
        //     else
        //         this.tank.stabilizeTank();

        //Rotate turret
        MoveAI.rotateTurret(this.tank);

        // Shoot simulation
        if (this.updateTir <= 0) {
            if (char1.shape == ShootAI.targetPlayer(this.tank)) {
                this.tank.addBullet(Date.now())
            }
            this.updateTir = 12;
        }
        this.updateTir--;
    }
}