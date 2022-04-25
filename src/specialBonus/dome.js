class dome extends SpecialBonus {

    constructor(tank) {
        super(tank, SPECIAL_BONUS_ID.DOME, 15000);
        this.isActive = true;
        this.createDome()
        this.life = 4;
    }

    createDome() {
        this.dome = new BABYLON.MeshBuilder.CreateSphere("dome", { diameter: 3 }, scene)
        var domeMaterial = new BABYLON.StandardMaterial("domeMaterial", scene);
        // domeMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
        domeMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0.2);
        this.dome.material = domeMaterial
        this.dome.visibility = 0.2;
        this.dome.parent = this.tank.shape
        this.dome.isVisible = false
        // this.dome.collider = 

    }

    use() {
        if (super.use()) {
            this.dome.isVisible = true
        }
    }
}