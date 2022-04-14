class Tree extends ObjectPos {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y, isBurning = undefined) {
        let tree = randomTree()
        super(tree, -width / 2 + x, Barrel.height / 2, -height / 2 + y, 0, 0)
        this.physicsImpostor = tree == ObjectEnum.Tumbleweed ? new BABYLON.PhysicsImpostor(this.shape, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1000, restitution: 0.2 }) :
            new BABYLON.PhysicsImpostor(this.shape, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 30000, restitution: 0.2 })
        this.isBurning = isBurning
    }

    burnTree() {
        if (this.isBurning == false) {
            var smok = createSmoke(this.shape, false, false, true)
            playSmoke(smok)
            createFire(this.shape);
            this.isBurning = true
        }
    }
}

function randomTree() {
    if (biome == "Snow") return ObjectEnum.SnowyTree;
    let rng = Math.floor(Math.random() * 3);
    let rng2 = Math.random()
    switch (rng) {
        case 0: return biome == "Earth" ? ObjectEnum.PalmTree1 : ObjectEnum.Cactus1;
        case 1: return biome == "Earth" ? ObjectEnum.PalmTree2 : ObjectEnum.Cactus2;
        default: return biome == "Earth" ? ObjectEnum.PalmTree3 : ObjectEnum.Tumbleweed;
    }
}