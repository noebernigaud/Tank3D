class Bonus extends ObjectPos {


    static diameter = 1;
    /**
     * 
     * @param {number} posX
     * @param {number} posY
     * @param {boolean} isSpecial
     */
    constructor(posX, posY, isSpecial = false) {
        super(ObjectEnum.Bullet, -width / 2 + posX, Bonus.diameter / 2, -height / 2 + posY, 0, 0, 1);
        this.physicsImpostor = new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 10000, restitution: 0.5 });
        var sourceMat = new BABYLON.StandardMaterial('sourceMat', scene);
        sourceMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        sourceMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
        sourceMat.specularColor = new BABYLON.Color3(1, 1, 0);
        this.createCollider()
    }

    createCollider() {
        this.physicsImpostor.onCollideEvent = (e1, e2) => {
            let b1 = bonuses.find(e => e == e1.object)
            if (e2.object == char1.shape) {
                if (b1) {
                    scene.menu.bonusChoice(this.randomBonus(3))
                    b1.dispose(true);
                }
            }
        }
    }

    randomBonus(num) {
        var res = []
        var copy_bonusEnum = BonusEnum.bonusEnumList.slice()
        for (var i = 0; i < num; i++) {
            var rand = Math.floor(Math.random() * copy_bonusEnum.length)
            res.push(copy_bonusEnum[rand])
            copy_bonusEnum.splice(rand, 1)
        }
        return res
    }

    createShape() {
        var shape = BABYLON.MeshBuilder.CreateBox("bonus", { size: Bonus.diameter }, scene);
        shape.material = createMaterial(scene, bonusImage.src);
        return shape;
    }

    dispose(forceDispose = false) {
        super.dispose(forceDispose)
    }
}