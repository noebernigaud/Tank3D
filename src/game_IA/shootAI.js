class ShootAI {
    /**
     * @param {Char} tank 
     * @returns {BABYLON.Mesh} the mesh targeted
     */
    static targetPlayer(tank) {

        return createRay(new BABYLON.Vector3(
            tank.shape.position.x + tank.getTurretTank().getDirection(BABYLON.Axis.Z).x * 5,
            tank.shape.position.y + 3 / 40,
            tank.shape.position.z + tank.getTurretTank().getDirection(BABYLON.Axis.X).x * 5),
            tank.getTurretTank().getDirection(BABYLON.Axis.Z), 1000);
    }
}