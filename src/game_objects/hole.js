class Hole extends ObjectPos {

    static height = 1;
    static diameter = 30;

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
            { diameter: Hole.diameter, height: 0 }, scene);
        shape.material = createMaterial(scene, holeImage.src);
        return shape;
    }
}