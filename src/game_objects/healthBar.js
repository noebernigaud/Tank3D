class Healthbar {
  /** @type{Char} */
  tank;
  /**
   * @param {Char} tank 
   */
  constructor(tank) {
    this.tank = tank;
    if (tank.type.name == ObjectEnum.Player.name) return;
    this.barWidth = 1;
    var dynamicTexture = new BABYLON.DynamicTexture("dt1", 512, scene, true);
    dynamicTexture.hasAlpha = true;

    var healthBarContainerMaterial = new BABYLON.StandardMaterial("hb2mat", scene);
    var healthBarContainer = BABYLON.MeshBuilder.CreatePlane("hb2", { width: this.barWidth, height: 0.1, subdivisions: 4 }, scene);

    healthBarContainerMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    healthBarContainerMaterial.emissiveColor = new BABYLON.Color4(0.08, 0.08, 0.08);
    // healthBarContainerMaterial.backFaceCulling = false;


    healthBarContainer.position = new BABYLON.Vector3(0, 0.7, 0);     // Position above player.

    healthBarContainer.parent = tank.shape;
    healthBarContainer.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_Y;
    healthBarContainer.material = healthBarContainerMaterial;
    this.healthBarContainerMaterial = healthBarContainerMaterial;
    this.healthBarContainer = healthBarContainer;


    // var healthBarTextMaterial = new BABYLON.StandardMaterial("hb3mat", scene);
    // healthBarTextMaterial.diffuseColor = new BABYLON.Color3(20 / 255, 112 / 255, 25 / 255);


    var healthBarTextMaterial = new BABYLON.StandardMaterial("hb3mat", scene);
    healthBarTextMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    healthBarTextMaterial.emissiveColor = new BABYLON.Color3(20.0 / 255, 112.0 / 255, 25.0 / 255);
    this.healthBarTextMaterial = healthBarTextMaterial;
  }

  updatePartition() {
    if (this.tank.type.name == ObjectEnum.Player.name) return;
    this.partitions = this.tank.maxHealth;
    let barsToDisplay = this.tank.health
    this.healthBarContainer.getChildMeshes().forEach(e => e.dispose())
    var paddingBar = 0.01;
    let partitionWidth = (this.barWidth - (this.partitions + 1) * paddingBar) / this.partitions;

    let createSmallBar = (offset, i) => {
      let xPos = offset * this.barWidth / 2 - offset * (i * (partitionWidth + paddingBar) + partitionWidth / 2) + paddingBar;
      console.log(xPos, xPos + paddingBar);
      var healthBarText = BABYLON.MeshBuilder.CreatePlane("hb3", { width: partitionWidth, height: 0.07, subdivisions: 4, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
      healthBarText.position = new BABYLON.Vector3(xPos, 0, offset * 0.01);
      healthBarText.material = this.healthBarTextMaterial;
      healthBarText.parent = this.healthBarContainer
    }

    for (let i = 0; i < barsToDisplay; i++) {
      createSmallBar(-1, i)
      // createSmallBar(1, i)
    }
  }
}