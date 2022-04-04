class Tree extends ObjectPos {

    static height = 0.01;
    static diameter = 0.8;

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        super(ObjectEnum.Tree, -width / 2 + x, Barrel.height / 2, -height / 2 + y, 0, 0)
        this.physicsImpostor = new BABYLON.PhysicsImpostor(this.shape, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 30000, restitution: 0.2 })
    }

    createShape() {
        var shape = BABYLON.MeshBuilder.CreateCylinder("hole",
            { diameter: Barrel.diameter, height: Barrel.height }, scene);
        shape.material = createMaterial(scene, barrelImage.src);
        return shape;
    }
}