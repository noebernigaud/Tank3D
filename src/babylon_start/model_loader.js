function loadModel() {
    var modelsToLoad = ["tank", "vehicle"];
    var modelName;
    var remainingLoad = modelsToLoad.length;

    var loadingDone = function () {
        remainingLoad--;
        if (remainingLoad === 0) {
            init()
            engine.hideLoadingUI()
        }
    }

    for (var i = 0; i < modelsToLoad.length; i++) {
        modelName = modelsToLoad[i];

        BABYLON.SceneLoader.ImportMesh("", "models/" + modelName + "/", modelsToLoad[i] + ".babylon", scene, function (meshes) {
            let meshesName = meshes.map(m => m.name);
            let modName;
            if (meshesName.includes("Body_1"))
                modName = modelsToLoad[0];
            else if (meshesName.includes("BODY_body"))
                modName = modelsToLoad[1];

            initModel(meshes, modName);
            loadingDone();
        });
        //     ,function (evt) {
        //         var loadedPercent = 0;
        //         if (evt.lengthComputable) loadedPercent = (evt.loaded * 100 / evt.total).toFixed();

        //         else {
        //             var dlCount = evt.loaded / (1024 * 1024);
        //             loadedPercent = Math.floor(dlCount * 100.0) / 100.0;
        //         }
        //         //$('#div0').html('%' + loadedPercent);
        //         document.getElementById('div0').innerHTML = loadedPercent;
        //     });
    }
}

function initModel(meshes, modelName) {
    switch (modelName) {
        case "tank":
            tankMeshes = [...meshes];

            tankMeshes.forEach(x => x.scaling = new BABYLON.Vector3(10, 10, 10));
            tankContainer = BABYLON.MeshBuilder.CreateBox("tankContainer", { height: 25, width: 38, depth: 70 }, scene);
            tankContainer.position.y += 12.70;
            tankMeshes.forEach(e => tankContainer.addChild(e));
            tankContainer.physicsImpostor = new BABYLON.PhysicsImpostor(tankContainer, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1000, restitution: 0 })

            //tankContainer.isVisible = false;
            tankContainer.visibility = 0.000001;
            tankContainer.showBoundingBox = true;
            camera.target = tankMeshes[3];
            break;

        case "vehicle":
            opponentMeshes = [...meshes];
            opponentMaterials = [
                scene.getMaterialById("vehicle_ifv_dmm08.dmm8_body"),
                scene.getMaterialById("vehicle_ifv_dmm08.wheel"),
                scene.getMaterialById("vehicle_ifv_dmm08.dmm8_cannon"),
                scene.getMaterialById("vehicle_ifv_dmm08.remote")
            ]

            opponentMeshes.forEach(x => x.scaling = new BABYLON.Vector3(10, 10, 10));

            //defineBoundingBox(opponentMeshes);

            opponentContainer = BABYLON.MeshBuilder.CreateBox("vehicleContainer", { height: 25, width: 30, depth: 70 }, scene);
            opponentContainer.position.y += 12.70;
            opponentContainer.position.x += 70;

            opponentMeshes.forEach(e => opponentContainer.addChild(e));
            opponentContainer.physicsImpostor = new BABYLON.PhysicsImpostor(opponentContainer, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1000, restitution: 0 })

            //tankContainer.isVisible = false;
            opponentContainer.visibility = 0.000001;
            opponentContainer.showBoundingBox = true;
            break;
    }
}