let getCannonPoint = (tank) => new BABYLON.Vector3(
    tank.shape.position.x + tank.getTurretTank().getDirection(BABYLON.Axis.Z).x * 8,
    tank.shape.position.y + tank.getTurretTank().getDirection(BABYLON.Axis.Z).y * 8 + 0.1,
    tank.shape.position.z + tank.getTurretTank().getDirection(BABYLON.Axis.X).x * 8
);

class ShootAI {
    /**
     * @param {Char} tank 
     * @returns {BABYLON.Mesh} the mesh targeted
     */
    static targetPlayer(tank, length = 1000, affiche = true, temps = 1000, pickedPoint = false, exclude = undefined) {
        let origin = getCannonPoint(tank)
        let dir = tank.getTurretTank().getDirection(BABYLON.Axis.Z)
        return createRay(
            origin, dir, length, affiche, temps, pickedPoint, exclude);
    }
}