async function addOpponent() {
    model2 = await BABYLON.SceneLoader.ImportMeshAsync("", "./models2/", "vehicle.babylon").then((meshes) => {
        opponentMeshes = [
            scene.getMeshById('BODY_body')
        ]
        opponentMaterials = [
            scene.getMaterialById("vehicle_ifv_dmm08.dmm8_body"),
            scene.getMaterialById("vehicle_ifv_dmm08.wheel"),
            scene.getMaterialById("vehicle_ifv_dmm08.dmm8_cannon"),
            scene.getMaterialById("vehicle_ifv_dmm08.remote")
        ]

        opponentMeshes.forEach(x => x.scaling = new BABYLON.Vector3(10, 10, 10));

        //defineBoundingBox(opponentMeshes);

        opponentContainer = BABYLON.MeshBuilder.CreateBox("Box", { height: 25, width: 30, depth: 70 }, scene);
        opponentContainer.position.y += 12.70;
        opponentContainer.position.x += 70;

        opponentMeshes.forEach(e => opponentContainer.addChild(e));
        opponentContainer.physicsImpostor = new BABYLON.PhysicsImpostor(opponentContainer, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1000, restitution: 0 })
        //tankContainer.isVisible = false;
        opponentContainer.visibility = 0.000001;
        opponentContainer.showBoundingBox = true;
        // tanksMeshes.forEach(e => e.physicsImpostor = new BABYLON.PhysicsImpostor(e, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0, pressure: 0 }));
    });
}

function destroyOpponent(isDisabled) {
    if (isDisabled) {
        explode(opponentContainer);
        var smok = createSmoke(opponentContainer);
        playSmoke(smok);
        opponentMaterials.forEach(m => m.emissiveColor = new BABYLON.Color3(0, 0, 0));
    }
}