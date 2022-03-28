class Bullet extends ObjectPos {


    static diameter = 10 / 20;
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
            char.shape.position.y + 9 / 40,
            char.shape.position.z + char.getTurretTank().getDirection(BABYLON.Axis.X).x * 6, char.bulletSpeed, 0, life);

        this.char = char;
        this.speed = char.bulletSpeed;

        this.physicsImpostor = new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 1 });
        let frontVec = char.getTurretTank().getDirection(BABYLON.Axis.Z)
        let moveVec = frontVec.scale(this.speed)
        let realVec = new BABYLON.Vector3(moveVec.x, 0, moveVec.z)
        // pourquoi la balle part un peu à gauche ou a droite
        this.physicsImpostor.setLinearVelocity(realVec)

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
                    if (b2) b2.dispose(true)
                } else if (b2 = walls.find(e => e.shape == e2.object)) {
                    b1.dispose()
                    if (b2) b2.destroy()
                }
                else if (b2 = holes.find(e => e.shape == e2.object)) {
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

    }

    // move() {
    //     super.move();

    //     if (this.live < 0) {
    //         this.removeBullet(this);
    //     }
    // }


    // move() {
    //     if (!super.move()) {
    //         this.speedAngle += Math.PI / 2
    //         if (!super.move())
    //             this.speedAngle += Math.PI / 2
    //     }
    // }

    /*
        move(maxX, maxY) {
     
            // FONCTIONS DE COLLISION AVEC LES MURS
            // entraine le rebond de la balle et la perte d'une de ses vies
     
            for (let wall of walls) {
     
                let collisionHappened = 0;
     
                //si un collision à gauche
                if (collL(this.x - 5, this.y - 5, 10, 10, wall.x, wall.y, wall.sizex, wall.sizey)
                    && (wall.noWallRight())
                    && (Math.cos(this.angle) > 0)) {
                    collisionHappened = 1;
                    this.angle = Math.atan2(Math.sin(this.angle), -Math.cos(this.angle));
                }
                //si un collision à droite
                else if (collR(this.x - 5, this.y - 5, 10, 10, wall.x, wall.y, wall.sizex, wall.sizey)
                    && (wall.noWallLeft())
                    && (Math.cos(this.angle) < 0)) {
                    collisionHappened = 1;
                    this.angle = Math.atan2(Math.sin(this.angle), -Math.cos(this.angle));
                }
                //si un collision en haut
                else if (collT(this.x - 5, this.y - 5, 10, 10, wall.x, wall.y, wall.sizex, wall.sizey)
                    && (wall.noWallBottom())
                    && (Math.sin(this.angle) > 0)) {
                    collisionHappened = 1;
                    this.angle = Math.atan2(-Math.sin(this.angle), Math.cos(this.angle));
                }
                //si un collision en bas
                else if (collB(this.x - 5, this.y - 5, 10, 10, wall.x, wall.y, wall.sizex, wall.sizey)
                    && (wall.noWallTop())
                    && (Math.sin(this.angle) < 0)) {
                    collisionHappened = 1;
                    this.angle = Math.atan2(-Math.sin(this.angle), Math.cos(this.angle));
                }
     
                //si une collision a eu lieu, la balle perd une vie et le mur se destruit (si il est destructible)
                if (collisionHappened == 1) {
                    this.live--;
                    if (this.live >= 0) { bulletBounceSound.play(); }
                    wall.destroy();
                    break;
                }
            }
     
            //FONCTIONS DE COLLISIONS ENTRE BALLES
            bullets.forEach(bullet => {
                if (coll(this.x - 5, this.y - 5, 10, 10, bullet.x - 5, bullet.y - 5, 10, 10)) {
                    bullet.removeBullet();
                    this.removeBullet();
                }
            }
            );
     
            //FONCTONS DE COLLISIONS AVEC UN CHAR
            chars.forEach(char => {
                if (coll(this.x - 5, this.y - 5, 10, 10, char.x - 20, char.y - 20, 40, 40)) {
                    char.removeChar();
                    this.removeBullet();
                }
            }
            );
     
     
            // LA BALLE AVANCE DE SE VITESSE DANS SA DIRECTION DONNEE PAR L'ANGLE
            this.x -= this.speed * Math.cos(this.angle);
            this.y -= this.speed * Math.sin(this.angle);
        }
     
        removeBullet() {
            bulletDestroyedSound.play();
            let position = bullets.indexOf(this);
            this.shape.dispose();
            bullets.splice(position, 1);
        }*/
}