class BullCharge extends SpecialBonus {
    constructor(tank) {
        super(tank, SPECIAL_BONUS_ID.BULL_CHARGE, 10000, 2000);
    }

    disable() {
        super.disable()
        this.tank.bullForce = null
    }

    use() {
        if (super.use() && !this.isActive) {
            this.bonusStartedDate = Date.now();
            super.activate()
            //normalized vector of our current direction
            let moveVec = this.tank.shape.getDirection(BABYLON.Axis.Z).scale(300000)
            this.tank.bullForce = new BABYLON.Vector3(moveVec.x, 0, moveVec.z)
            this.tank.physicsImpostor.onCollideEvent = (e1, e2) => {
                let c1 = chars.find(e => e.shape == e1.object)
                if (!c1.bullForce) return
                let c2;
                if (c2 = charsAI.find(e => e.shape == e2.object)) {
                    if (c2) {
                        c2.healthLoss(5000)
                        current_level_dico.addKilledChar()
                    }
                }
            }
        }
    }
}