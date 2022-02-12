x = 1;
y = 1;
z = 1;
w = 1;
class Bullet extends ObjectPos {

    static diameter = 5;
    /**
     * 
     * @param {Char} char 
     * @param {number} live 
     * @param {number} speed 
     */
    constructor(char, live, speed, chars) {
        super(
            ObjectEnum.Bullet,
            tankContainer.position.x + tankMeshes[4].getDirection(BABYLON.Axis.Z).x * 10,//+ 30 * Math.sin(-tankMeshes[4].rotationQuaternion.toEulerAngles().y - Math.PI / 2 - tankContainer.rotationQuaternion.toEulerAngles().y),
            //tankMeshes[4].absolutePosition.x + 50,// * Math.sin(Math.atan(tankMeshes[4].getDirection(new BABYLON.Vector3(0, 0, 1))[2] / tankMeshes[4].getDirection(new BABYLON.Vector3(0, 0, 1))[0])),
            Char.height / 2,
            tankContainer.position.z + tankMeshes[4].getDirection(BABYLON.Axis.X).x * 10);//+ 30 * Math.cos(-tankMeshes[4].rotationQuaternion.toEulerAngles().y - Math.PI / 2 - tankContainer.rotationQuaternion.toEulerAngles().y), speed, tankMeshes[4].rotation.y);
        //tankMeshes[4].absolutePosition.z + 50);// * Math.cos(Math.atan(tankMeshes[4].getDirection(new BABYLON.Vector3(0, 0, 1))[2] / tankMeshes[4].getDirection(new BABYLON.Vector3(0, 0, 1))[0])));
        this.live = live;
        this.char = char;
        this.chars = chars;
        this.life = 8;
        this.speed = 50;

        this.physicsImpostor = new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 5, restitution: 0 });
        let frontVec = tankMeshes[4].getDirection(BABYLON.Axis.Z)
        let moveVec = frontVec.scale(this.speed)
        let realVec = new BABYLON.Vector3(moveVec.x, 0, moveVec.z)
        // pourquoi la balle part un peu à gauche ou a droite
        this.physicsImpostor.setLinearVelocity(realVec)
        //this.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(speed * Math.sin(char.rotation.y * x), 0, speed * Math.cos(char.rotation.y * x)));
        this.physicsImpostor.restitution = 1;
        this.physicsImpostor.mass = 1;
        this.physicsImpostor.friction = 0;
        this.coolDownCol = 0;

        this.createCollider()
    }

    createCollider() {
        this.physicsImpostor.registerOnPhysicsCollide(chars.map(x => x.physicsImpostor), (e1, e2) => {
            e1.object.dispose();
            e2.object.dispose();
        })

        this.physicsImpostor.registerOnPhysicsCollide(opponentContainer.physicsImpostor, (e1, e2) => {
            e1.object.dispose();
            destroyOpponent(true);
        })

        this.physicsImpostor.onCollideEvent = (b, w) => {
            // let angle = Math.atan2(this.physicsImpostor.getLinearVelocity().y, this.physicsImpostor.getLinearVelocity().x);
            // this.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(Math.cos(angle) * 1000, 0, -Math.sin(angle) * 1000));

            this.life -= 1;
            if (this.life === 0) this.dispose();
            return;
        }
    }

    createShape() {
        var shape = BABYLON.MeshBuilder.CreateSphere("bullet",
            { diameter: Bullet.diameter }, scene);
        shape.material = createMaterial(scene, bulletImage.src);

        return shape;
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
