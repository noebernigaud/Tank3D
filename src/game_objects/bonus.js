class Bonus extends ObjectPos {


    static diameter = 1;
    /**
     * 
     * @param {number} posX
     * @param {number} posY
     * @param {boolean} isSpecial
     */
    constructor(posX, posY, isSpecial = false) {
        super(ObjectEnum.Bullet, posX, posY, 2, 0, 0, 1);
        this.physicsImpostor = new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.5 });
        var sourceMat = new BABYLON.StandardMaterial('sourceMat', scene);
        sourceMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        sourceMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
        sourceMat.specularColor = new BABYLON.Color3(1, 1, 0);

        this.trail.material = sourceMat;
        this.collision = false;
        bullets.push(this)
    }

    createCollider() {
        this.physicsImpostor.registerOnPhysicsCollide(impostorCharList, (e1, e2) => {
            let b1 = bullets.find(e => e == e1.object)
            let c1 = chars.find(e => e.shape == e2.object)

            if (b1) b1.dispose()
            if (c1) c1.dispose()
        })

        this.physicsImpostor.registerOnPhysicsCollide(bullets.map(x => x.physicsImpostor), (e1, e2) => {
            let b1 = bullets.find(e => e == e1.object)
            let b2 = bullets.find(e => e == e2.object)

            if (b1) b1.dispose()
            if (b2) b2.dispose()

        })

        this.physicsImpostor.registerOnPhysicsCollide(holes.map(x => x.physicsImpostor), (e1, e2) => {
            let b1 = bullets.find(e => e == e1.object)
            if (b1) b1.dispose()

            createFire(e2.object);
            createSmoke(e2.object);
            // e2.object._children.forEach(m => {
            //     if (m.material != null) {
            //         m.material._albedoColor = new BABYLON.Color3(0, 0, 0)
            //     }
            // });
        })

        this.physicsImpostor.registerOnPhysicsCollide(walls.map(x => x.physicsImpostor), (e1, e2) => {
            let wall = walls.find(e => e.shape == e2.object)
            if (wall)
                wall.destroy()
        })

        this.physicsImpostor.onCollideEvent = (b, w) => {
            if (this.collision == false) {
                this.collision = true
                setTimeout(() => {
                    this.collision = false
                }, 10);
            } else return
            if (bullets.includes(w.object)) {
                return;
            }
            this.dispose()
            return;
        }
    }

    createShape() {
        var shape = BABYLON.MeshBuilder.CreateBox("bonus", { size: Bonus.diameter }, scene);
        shape.material = createMaterial(scene, bonusImage.src);
        return shape;
    }

    dispose(forceDispose = false) {
        super.dispose(forceDispose)
        if (this.life <= 0 || forceDispose) this.trail.dispose()
        if (forceDispose) return;
        bulletExplode(this.position, this.life == 0).start();
        if (this.life > 0) {
            bulletDestroyedSound.pause();
            bulletDestroyedSound.currentTime = 0;
            bulletDestroyedSound.play();
        }

    }