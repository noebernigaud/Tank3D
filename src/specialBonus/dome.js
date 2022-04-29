class dome extends SpecialBonus {

    constructor(tank) {
        super(tank, SPECIAL_BONUS_ID.DOME, 15000);
        this.life = 4;
        this.maxLife = 4;
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
    }

    update() {
        if (this.isActive) {
            bullets.forEach(e => {
                if (this.dome.intersectsMesh(e) && e.char != this.tank) {
                    this.life--;
                    e.dispose(true, true);
                }
            })
            if (this.life <= 0) {
                this.disable()
                this.dome.dispose();
                this.resetTime()
                this.life = this.maxLife;
            }
        } else {
            super.update();
        }

    }

    use() {
        if (super.use()) {
            this.createDome()
            this.dome.isVisible = true
            this.activate()
        }
    }
}