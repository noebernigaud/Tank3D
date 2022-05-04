class Battery extends ObjectPos {

    static height = 0.01;
    static diameter = 0.8;

    /**
     * 
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        super(ObjectEnum.Battery, -width / 2 + x, Battery.height / 2, -height / 2 + y, 0, 0)
        this.physicsImpostor = new BABYLON.PhysicsImpostor(this.shape, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 3000, restitution: 0.2 })

        this.batteryEffect = createBonusEffect(this.shape, true)
        this.isDestroyed = false
    }
}