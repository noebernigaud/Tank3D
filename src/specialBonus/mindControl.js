class MindControl extends SpecialBonus {
    constructor(tank) {
        super(tank, SPECIAL_BONUS_ID.MIND_CONTROL, 10000, 10000);
    }

    disable() {
        super.disable()
        this.hitTanks.forEach(c => { c[0].strategy = c[1] })
        hlControlled.removeAllMeshes()
    }

    use() {
        if (super.use() && !this.isActive) {
            this.bonusStartedDate = Date.now();
            super.activate()
            this.hitTanks = []
            charsAI.forEach(c => {
                if (Math.sqrt((c.shape.position.x - this.tank.shape.position.x) ** 2 +
                    (c.shape.position.y - this.tank.shape.position.y) ** 2 +
                    (c.shape.position.z - this.tank.shape.position.z) ** 2) < 10) {
                    this.hitTanks.push([c, c.strategy])
                    c.strategy = new guaranteedAI(c, false)
                    let fileterMeshToHigLight = c.shape.getChildMeshes().filter(m =>
                        !(c.healtBar.healthBarContainer && ((m == c.healtBar.healthBarContainer) || (c.healtBar.healthBarContainer.getChildMeshes().includes(m)))));
                    fileterMeshToHigLight.forEach(m => hlControlled.addMesh(m, new BABYLON.Color3(1, 0, 1)))
                }
            })
        }
    }
}