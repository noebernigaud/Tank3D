class Bullet extends ObjectPos {


    static diameter = 4 / 20;
    /**
     * 
     * @param {Char} char 
     * @param {number} life 
     * @param {number} speed
     */
    constructor(char, life = 2) {
        super(
            ObjectEnum.Bullet,
            char.shape.position.x + char.getTurretTank().getDirection(BABYLON.Axis.Z).x * 6,
            // char.shape.position.y + char.getTurretTank().getDirection(BABYLON.Axis.Y).y * 4,
            char.shape.position.y + 9 / 40,
            char.shape.position.z + char.getTurretTank().getDirection(BABYLON.Axis.X).x * 6, char.bulletSpeed, 0, char.bulletLife);

        this.char = char;
        this.speed = char.bulletSpeed;
        this.damage = char.bulletDamage;

        this.physicsImpostor = new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 1 });
        let frontVec = char.getTurretTank().getDirection(BABYLON.Axis.Z)
        let moveVec = frontVec.scale(this.speed)
        // let moveVec = new BABYLON.Vector3(moveVec.x, 0, moveVec.z)
        // pourquoi la balle part un peu à gauche ou a droite
        this.physicsImpostor.setLinearVelocity(moveVec)

        // this.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(speed * Math.sin(char.rotation.y * x), 0, speed * Math.cos(char.rotation.y * x)));

        // this.physicsImpostor.restitution = 1;
        // this.physicsImpostor.mass = 1;
        this.physicsImpostor.friction = 0;
        this.coolDownCol = 0;
        bulletExplode(this.position, false, true).start()

        this.createCollider()

        this.trail = new BABYLON.TrailMesh('bulletTrail', this, scene, 0.06, 12, true);

        var sourceMat = new BABYLON.StandardMaterial('sourceMat', scene);
        sourceMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        sourceMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
        sourceMat.specularColor = new BABYLON.Color3(1, 1, 0);

        this.trail.material = sourceMat;
        this.collision = false;
        bullets.push(this)

        this.bulletReboundSound = new Audio('audio/Collision8-Bit.ogg');

        if (char1 == char) current_level_dico.addBulletFired()
    }

    createCollider() {
        this.physicsImpostor.onCollideEvent = (e1, e2) => {

            let b1 = bullets.find(e => e == e1.object)
            let b2;
            if (this.collision == false) {
                this.collision = true
                setTimeout(() => {
                    this.collision = false
                }, 10);
            } else return
            if (this.collision) {
                if (b2 = bullets.find(e => e == e2.object)) {
                    if (b1) b1.dispose(true, true)
                    if (b2) b2.dispose(true, true)
                } else if (b2 = chars.find(e => e.shape == e2.object)) {
                    if (b1) b1.dispose(true, true)
                    if (b2) b2.healthLoss(this.damage)
                    if (this.char == char1 && b2 != char1 && b2.life <= 0)
                        current_level_dico.addKilledChar()
                } else if (b2 = walls.find(e => e.shape == e2.object)) {
                    if (b1) b1.dispose()
                    if (b2) b2.destroy()
                    if (this.char == char1 && b2.destructable)
                        current_level_dico.addWallDestroyed()
                }
                else if (b2 = barrels.find(e => e.shape == e2.object)) {
                    if (b1) b1.dispose()
                    createFire(e2.object);
                    createSmoke(e2.object);
                }
                else this.dispose()
            }

        }
    }

    createShape() {
        var shape = BABYLON.MeshBuilder.CreateSphere("bullet", { diameter: Bullet.diameter }, scene);
        shape.material = createMaterial(scene, bulletImage.src);

        return shape;
    }

    dispose(forceDispose = false, explosion = false) {
        super.dispose(forceDispose)
        if (this.life <= 0 || forceDispose) this.trail.dispose()
        if (forceDispose && !explosion) return;
        bulletExplode(this.position, this.life == 0).start();
        if (this.life > 0) {
            this.bulletReboundSound.pause();
            this.bulletReboundSound.currentTime = 0;
            this.bulletReboundSound.play();
        }

    }
}