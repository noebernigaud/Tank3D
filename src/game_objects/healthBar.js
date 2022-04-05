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

    healthBarContainerMaterial.diffuseColor = BABYLON.Color3.Gray();
    healthBarContainerMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1)
    healthBarContainerMaterial.backFaceCulling = false;


    healthBarContainer.position = new BABYLON.Vector3(0, 0.7, 0);     // Position above player.

    healthBarContainer.parent = tank.shape;
    healthBarContainer.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_Y;
    healthBarContainer.material = healthBarContainerMaterial;
    this.healthBarContainerMaterial = healthBarContainerMaterial;
    this.healthBarContainer = healthBarContainer;
    this.partitions = 10;
  }

  updatePartition() {
    if (this.tank.type.name == ObjectEnum.Player.name) return;
    this.healthBarContainer.getChildMeshes().forEach(e => e.dispose())
    var paddingBar = 0.02;
    let barsToDisplay = Math.round(this.tank.health / this.tank.maxHealth * this.partitions)
    let partitionWidth = (this.barWidth - (this.partitions + 1) * paddingBar) / this.partitions;
    var healthBarTextMaterial = new BABYLON.StandardMaterial("hb3mat", scene);
    healthBarTextMaterial.diffuseColor = BABYLON.Color3.Black();

    let createSmallBar = (offset, i) => {
      let xPos = offset * this.barWidth / 2 - offset * (i * (partitionWidth + paddingBar) + partitionWidth / 2) + paddingBar;
      var healthBarText = BABYLON.MeshBuilder.CreatePlane("hb3", { width: partitionWidth, height: 0.08, subdivisions: 4, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
      healthBarText.position = new BABYLON.Vector3(xPos, 0, offset * 0.01);
      healthBarText.material = healthBarTextMaterial;
      healthBarText.parent = this.healthBarContainer
    }

    for (let i = 0; i < barsToDisplay; i++) {
      createSmallBar(-1, i)
      // createSmallBar(1, i)
    }
  }
}