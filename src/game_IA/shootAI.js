let f = (tank) => new BABYLON.Vector3(
    tank.shape.position.x + tank.getTurretTank().getDirection(BABYLON.Axis.Z).x * 7,
    tank.shape.position.y + 3 / 40,
    tank.shape.position.z + tank.getTurretTank().getDirection(BABYLON.Axis.X).x * 7
);

class ShootAI {
    /**
     * @param {Char} tank 
     * @returns {BABYLON.Mesh} the mesh targeted
     */
    static targetPlayer(tank, length = 1000, affiche = false, temps = 1000, pickedPoint = false, exclude = undefined) {
        let origin = f(tank)
        let dir = tank.getTurretTank().getDirection(BABYLON.Axis.Z)
        return createRay(
            origin, dir, length, affiche, temps, pickedPoint, exclude);
    }
}