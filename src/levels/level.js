class Level {
  stats = {
    numberKilledChar: 0,
    numberBonusObtained: 0,
    numberBulletFired: 0,
    totalDistance: 0,
    wallDestroyed: 0,
  }

  constructor(levelInfo) {
    this.level = levelInfo.level;
    this.sol = levelInfo.sol;
    this.minHeightMap = levelInfo.minHeightMap;
    this.functionNextLevel = levelInfo.functionNextLevel;
  }

  goNextLevel() {
    let res = this.functionNextLevel()
    if (res) console.log(this.stats);
    return res
  }

  addDistance(distance) {
    this.stats.totalDistance += distance;
  }

  addKilledChar() {
    this.stats.numberKilledChar++;
  }

  addBulletFired() {
    this.stats.numberBulletFired++;
  }

  addBonusObtained() {
    this.stats.numberBonusObtained++;
  }

  addWallDestroyed() {
    this.stats.wallDestroyed++;
  }
}
