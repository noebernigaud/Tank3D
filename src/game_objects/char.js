
class Char {
  /** @type {BABYLON.Mesh} */
  shape;
  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} angle 
   * @param {number} vitesse 
   * @param {number} tempsMinEntreTirsEnMillisecondes 
   * @param {HTMLImageElement} img 
   */
  constructor(x, y, angle, vitesse, tempsMinEntreTirsEnMillisecondes, img) {
    this.sizex = cell_size - 5;
    this.sizey = cell_size - 5;
    this.x = x;
    this.y = y;
    this.height = cell_size - 5;
    this.angle = angle;
    this.v = vitesse;
    this.delayMinBetweenBullets = tempsMinEntreTirsEnMillisecondes;
    this.delayMinBetweenMines = 5000;
    this.intelligence = new Intelligence(this);
    this.img = img;
    this.shape = create_3d_shape(this, img.src)
  }

  draw3d() {
    place_object(this);
    this.shape.rotation.y = this.angle;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.translate(-this.sizex / 2 - 12, -this.sizey / 2);
    ctx.drawImage(this.img, 0, 0, this.sizex + 12, this.sizey);
    ctx.restore();

  }

  move(speedX, speedY) {
    //deplace le tank
    let old_x = this.x;
    let old_y = this.y;
    this.x = this.x + speedX * this.v;
    this.y = this.y + speedY * this.v;
    if (collision(this)) {
      this.x = old_x;
      this.y = old_y;
    }
    this.draw3d();
  }

  moveForeward(coeff) {
    this.move(Math.cos(camera.rotation.y - Math.PI / 2) * coeff, Math.sin(camera.rotation.y - Math.PI / 2) * coeff);
  }

  moveBackward(coeff) {
    this.move(-Math.cos(camera.rotation.y - Math.PI / 2) * coeff, -Math.sin(camera.rotation.y - Math.PI / 2) * coeff);
  }

  //FONCTIONS UTILITAIRES DE VERIFICATION DES COLLISIONS AVEC AUTRES OBJETS DANS LES DIFFERENTES DIRECTIONS

  collObjL() {
    if (walls.every(wall => !collL(this.x, this.y, this.sizex, this.sizey, wall.x, wall.y, wall.sizex, wall.sizey))) {
      if (holes.every(hole => !collL(this.x, this.y, this.sizex, this.sizey, hole.x, hole.y, hole.sizex, hole.sizey))) {
        if (chars.every(char => !collL(this.x, this.y, this.sizex, this.sizey, char.x, char.y, char.sizex, char.sizey))) {
          return false;
        }
      }
    }
    return true;
  }

  collObjR() {
    if (walls.every(wall => !collR(this.x, this.y, this.sizex, this.sizey, wall.x, wall.y, wall.sizex, wall.sizey))) {
      if (holes.every(hole => !collR(this.x, this.y, this.sizex, this.sizey, hole.x, hole.y, hole.sizex, hole.sizey))) {
        if (chars.every(char => !collR(this.x, this.y, this.sizex, this.sizey, char.x, char.y, char.sizex, char.sizey))) {
          return false;
        }
      }
    }
    return true;
  }

  collObjT() {
    if (walls.every(wall => !collT(this.x, this.y, this.sizex, this.sizey, wall.x, wall.y, wall.sizex, wall.sizey))) {
      if (holes.every(hole => !collT(this.x, this.y, this.sizex, this.sizey, hole.x, hole.y, hole.sizex, hole.sizey))) {
        if (chars.every(char => !collT(this.x, this.y, this.sizex, this.sizey, char.x, char.y, char.sizex, char.sizey))) {
          return false;
        }
      }
    }
    return true;
  }

  collObjB() {
    if (walls.every(wall => !collB(this.x, this.y, this.sizex, this.sizey, wall.x, wall.y, wall.sizex, wall.sizey))) {
      if (holes.every(hole => !collB(this.x, this.y, this.sizex, this.sizey, hole.x, hole.y, hole.sizex, hole.sizey))) {
        if (chars.every(char => !collB(this.x, this.y, this.sizex, this.sizey, char.x, char.y, char.sizex, char.sizey))) {
          return false;
        }
      }
    }
    return true;
  }


  //DEPLACEMENT DU CHAR DANS UNE DIRECTION SI IL N'Y A PAS COLLISION

  moveL(coeff) {
    if (!this.collObjL()) { this.move(-coeff, 0); }
  }

  moveR(coeff) {
    if (!this.collObjR()) { this.move(coeff, 0); }
  }

  moveT(coeff) {
    if (!this.collObjT()) { this.move(0, -coeff); }
  }

  moveB(coeff) {
    if (!this.collObjB()) { this.move(0, coeff); }
  }


  updateAngle(degree) {
    let new_angle = camera.rotation.y + degree - Math.PI * 3 / 2;
    // if (collision(this)) return;
    camera.rotation.y += degree;
    this.angle = new_angle;
  }

  addBullet(time) {
    // si le temps écoulé depuis le dernier tir est > temps max alors on tire
    var tempEcoule = 0;

    if (this.lastBulletTime !== undefined) {
      tempEcoule = time - this.lastBulletTime;
    }

    if ((this.lastBulletTime === undefined) || (tempEcoule > this.delayMinBetweenBullets)) {
      let startposx = this.x - (this.sizex + 5) * Math.cos(this.angle);
      let startposy = this.y - (this.sizex + 5) * Math.sin(this.angle);
      if (walls.every(wall => !this.isInto(startposx, startposy, wall.x, wall.y, wall.sizex, wall.sizey))) {
        bullets.push(new Bullet(this, 1, 5));
        bulletFiredSound.play();
        // on mémorise le dernier temps.
        this.lastBulletTime = time;
      }
    }
  }

  isInto(startposx, startposy, wallx, wally, sx, sy) {
    return ((startposx > wallx) && (startposx < wallx + sx) && (startposy > wally) && (startposy < wally + sy))
  }

  addMine(time) {
    var tempEcouleMine = 0;

    if (this.lastMineTime !== undefined) {
      tempEcouleMine = time - this.lastMineTime;
    }

    if ((this.lastMineTime === undefined) || (tempEcouleMine > this.delayMinBetweenMines)) {
      minePlacedSound.play();
      mines.push(new Mine(this));
      // on mémorise le dernier temps.
      this.lastMineTime = time;
    }
  }

  removeChar() {
    let position = chars.indexOf(this);
    this.shape.dispose();
    chars.splice(position, 1);
    explosionSound.play();
    if (this === char1) {
      stopgame();
    }
    else {
      position = charsAI.indexOf(this);
      charsAI.splice(position, 1);
    }
  }
}
