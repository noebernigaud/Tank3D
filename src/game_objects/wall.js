class Wall {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {boolean} destructable 
     */
    constructor(x, y, destructable) {
        this.x = x;
        this.y = y;
        this.height = cell_size;
        this.sizex = cell_size;
        this.sizey = cell_size;
        this.destructable = destructable
        this.shape = create_3d_shape(this, this.destructable ? wallDTexture.src : wallTexture.src)
    }

    draw3d() {
        place_object(this);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.destructable === true) {
            ctx.drawImage(wallDTexture, 0, 0, this.sizex, this.sizey);
        }
        else {
            ctx.drawImage(wallTexture, 0, 0, this.sizex, this.sizey);
        }
        ctx.restore();
    }

    destroy() {
        if (this.destructable === true) {
            let position = walls.indexOf(this);
            this.shape.dispose();
            walls.splice(position, 1);
        }
    }

    noWallLeft() {
        for (let otherWall of walls) {
            if (collL(this.x, this.y + 10, this.sizex, this.sizey - 20, otherWall.x, otherWall.y, otherWall.sizex, otherWall.sizey)) {
                return false;
            }

        }
        return true;
    }

    noWallRight() {
        for (let otherWall of walls) {
            if (collR(this.x, this.y + 10, this.sizex, this.sizey - 20, otherWall.x, otherWall.y, otherWall.sizex, otherWall.sizey)) {
                return false;
            }
        }
        return true;
    }

    noWallBottom() {
        for (let otherWall of walls) {
            if (collB(this.x + 10, this.y, this.sizex - 20, this.sizey, otherWall.x, otherWall.y, otherWall.sizex, otherWall.sizey)) {
                return false;
            }
        }
        return true;
    }

    noWallTop() {
        for (let otherWall of walls) {
            if (collT(this.x + 10, this.y, this.sizex - 20, this.sizey, otherWall.x, otherWall.y, otherWall.sizex, otherWall.sizey)) {
                return false;
            }

        }
        return true;
    }


}