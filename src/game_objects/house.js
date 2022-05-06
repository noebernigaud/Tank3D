class House extends ObjectPos {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        super(chooseHouse(), -width / 2 + x, -height / 2, -height / 2 + y, 0, 0)
        this.physicsImpostor = new BABYLON.PhysicsImpostor(this.shape, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 70000, restitution: 0.2 })
    }
}

function chooseHouse() {
    switch (biome) {
        case "Earth": return ObjectEnum.SnowyHut;
        case "Sand": return ObjectEnum.SnowyHut;
        default: return ObjectEnum.SnowyHut;
    }
}