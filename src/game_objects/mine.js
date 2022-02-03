class Mine {
    /**
     * @param {Char} char 
     */
    constructor(char) {
        this.char = char;
        this.sizex = 20;
        this.sizey = 20;
        this.height = 5;
        this.x = char.x;
        this.y = char.y;
    }

    draw3d() {
        place_object(this);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = 'yellow';
        ctx.drawImage(mineImage, 0, 0, this.sizex, this.sizey);
        ctx.restore();
        this.checkCollision();
    }

    checkCollision() {
        chars.forEach(char => {
            if ((char !== this.char) && (coll(this.x, this.y, this.sizex, this.sizey, char.x, char.y, char.sizex, char.sizey))) {
                this.remove();
                char.removeChar();
            }
        })
    }

    remove() {
        let position = mines.indexOf(this);
        this.shape.dispose();
        mines.splice(position, 1);
    }

    createShape() {
        var shape = BABYLON.MeshBuilder.CreateCylinder("mine",
            { diameter: obj.sizex, height: 3 }, scene);
        shape.material = createMaterial(scene, mineImage.src);
        return shape;
    }
}