class ShootAI {
    /**
     * @param {Char} tank 
     * @returns {boolean}
     */
    static targetPlayer(tank) {

        let length = 1000;
        let ray = new BABYLON.Ray(new BABYLON.Vector3(
            tank.shape.position.x + tank.getTurretTank().getDirection(BABYLON.Axis.Z).x * 5,
            tank.shape.position.y + 3 / 40,
            tank.shape.position.z + tank.getTurretTank().getDirection(BABYLON.Axis.X).x * 5), tank.getTurretTank().getDirection(BABYLON.Axis.Z), length);

        let pickInfo = scene.pickWithRay(ray, (mesh) => {
            return mesh;
        });
        if (pickInfo.pickedMesh) {
            let bounder = pickInfo.pickedMesh;
        }

        let rayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(scene, new BABYLON.Color3(1, 0, 0));
        setTimeout(() => {
            rayHelper.dispose(ray);
        }, 10);

        return pickInfo.pickedMesh
    }
}