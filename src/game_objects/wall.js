class Wall extends ObjectPos {

    static height = cell_size;
    static width = cell_size;
    static depth = cell_size;
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {boolean} destructable 
     */
    constructor(x, y, destructable) {
        super(destructable ? ObjectEnum.WallD : ObjectEnum.Wall, -width / 2 + x, Wall.height / 2, - height / 2 + y, 0, 0)
        this.physicsImpostor = new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 1, friction: 5 });
    }

    destroy() {
        if (this.destructable === true) {
            let position = walls.indexOf(this);
            this.shape.dispose();
            walls.splice(position, 1);
        }
    }
    /*
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
        }*/

    createShape() {
        var shape = BABYLON.MeshBuilder.CreateBox("box",
            { height: Wall.height, width: Wall.width, depth: Wall.depth }, scene);
        shape.material = createMaterial(scene, this.type.name);
        return shape;
    }
}