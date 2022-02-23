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
        this.physicsImpostor = new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 1, friction: 5 });
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