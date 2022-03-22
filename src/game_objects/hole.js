class Hole extends ObjectPos {

    static height = 0.01;
    static diameter = 0.8;

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        super(ObjectEnum.Hole, -width / 2 + x, Hole.height / 2, -height / 2 + y, 0, 0)
        this.shape.physicsImpostor = new BABYLON.PhysicsImpostor(this.shape, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 3000, restitution: 0.2 })
        // this.shape.getChildMeshes().forEach(e => e.material.emissiveColor = new BABYLON.Color3(1, 1, 1))
    }

    draw3d() {
        place_object(this);
    }

    createShape() {
        var shape = BABYLON.MeshBuilder.CreateCylinder("hole",
            { diameter: Hole.diameter, height: Hole.height }, scene);
        shape.material = createMaterial(scene, holeImage.src);
        return shape;
    }
}