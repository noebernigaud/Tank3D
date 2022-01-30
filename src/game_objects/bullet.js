class Bullet {
    /**
     * 
     * @param {Char} char 
     * @param {number} live 
     * @param {number} speed 
     */
    constructor(char, live, speed) {
        this.angle = -char.angle;
        this.sizex = 5;
        this.sizey = 5;
        this.x = char.x + (char.sizex + 5) * Math.sin(this.angle);
        this.y = char.y + (char.sizey + 5) * Math.cos(this.angle);
        this.live = live;
        this.speed = speed;
        this.shape = create_3d_shape(this, bulletImage.src);
        this.char = char
    }

    draw3d() {
        place_object(this);
        this.move();

        if (this.live < 0) {
            this.removeBullet(this);
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + 3.16);
        ctx.drawImage(bulletImage, 0, 0, 20, 10);
        ctx.restore();

        this.move();

        if (this.live < 0) {
            this.removeBullet(this);
        }
    }


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
                this.angle = Math.atan2(Math.sin(this.angle), Math.cos(this.angle));
            }
            //si un collision à droite
            else if (collR(this.x - 5, this.y - 5, 10, 10, wall.x, wall.y, wall.sizex, wall.sizey)
                && (wall.noWallLeft())
                && (Math.cos(this.angle) < 0)) {
                collisionHappened = 1;
                this.angle = Math.atan2(Math.sin(this.angle), Math.cos(this.angle));
            }
            //si un collision en haut
            else if (collT(this.x - 5, this.y - 5, 10, 10, wall.x, wall.y, wall.sizex, wall.sizey)
                && (wall.noWallBottom())
                && (Math.sin(this.angle) > 0)) {
                collisionHappened = 1;
                this.angle = Math.atan2(Math.sin(this.angle), Math.cos(this.angle));
            }
            //si un collision en bas
            else if (collB(this.x - 5, this.y - 5, 10, 10, wall.x, wall.y, wall.sizex, wall.sizey)
                && (wall.noWallTop())
                && (Math.sin(this.angle) < 0)) {
                collisionHappened = 1;
                this.angle = Math.atan2(Math.sin(this.angle), Math.cos(this.angle));
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
        this.x += this.speed * Math.sin(this.angle);
        this.y += this.speed * Math.cos(this.angle);
    }

    removeBullet() {
        bulletDestroyedSound.play();
        let position = bullets.indexOf(this);
        this.shape.dispose();
        bullets.splice(position, 1);
    }
}
