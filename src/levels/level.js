const lvlStatus = {
  DIE: 0,
  WIN: 1,
  NXT_LVL: 2
};

class Level {
  stats = {
    "Char Killed": 0,
    "Bonus Obtained": 0,
    "Bullet Fired": 0,
    "Total Distance": 0,
    "Wall destroyed": 0
  }

  constructor(levelInfo) {
    this.level = levelInfo.level;
    this.minHeightMap = levelInfo.minHeightMap;
    this.lvlObjective = levelInfo.lvlObjective;
    this.biome = levelInfo.biome;
  }

  createMessage() {
    let parentDiv = document
      .getElementsByClassName('currentMission')[0];

    parentDiv.innerHTML = "";
    let createLine = ([a, b, c]) => {
      let d = document.createElement('div');
      let s1 = document.createElement('span');
      let s2 = document.createElement('span');
      d.appendChild(s1);
      d.appendChild(s2);
      s1.innerHTML = a;
      s2.innerHTML = b() + '/' + c();
      return d;
    }

    this.lvlObjective.tip.forEach(
      e => parentDiv.appendChild(createLine(e)));
  }

  canGoNextLevel() {
    this.createMessage();
    return this.lvlObjective.goToNextLevel()
  }

  goNextLevel(status = lvlStatus.NXT_LVL) {
    console.log("in other menu", scene.menu.inOtherMenu());
    if (!scene.menu.inOtherMenu()) {
      scene.menu.inNextLevel = true;
      Array.from(document.getElementsByClassName("gameBarsClass")).forEach(e => e.style.display = 'none')
      exitPointerLoc()
      this.writeStat(status)
    }
  }

  addDistance(distance) {
    this.stats["Total Distance"] += distance;
  }

  addKilledChar() {
    this.stats["Char Killed"]++;
  }

  addBulletFired() {
    this.stats["Bullet Fired"]++;
  }

  addBonusObtained() {
    console.log(this.stats["Bonus Obtained"], "ADDING BONUS TOTAL ", this.stats["Bonus Obtained"] + 1);
    this.stats["Bonus Obtained"]++;
    console.log(this.stats["Bonus Obtained"], "AFTER ");
  }

  addWallDestroyed() {
    this.stats["Wall destroyed"]++;
  }

  getDistance() {
    return this.stats["Total Distance"];
  }

  getKilledChar() {
    return this.stats["Char Killed"];
  }

  getBulletFired() {
    return this.stats["Bullet Fired"];
  }

  getBonusObtained() {
    return this.stats["Bonus Obtained"];
  }

  getWallDestroyed() {
    return this.stats["Wall destroyed"];
  }

  /**
   * @param {number} status 
   */
  writeStat(status) {

    if (status === lvlStatus.WIN) applauseSound.play()

    document.getElementById("endLevelStat").style.display = "block"
    let tab = document.getElementById("tableStat")
    tab.innerHTML = "";

    let createTd = content => {
      let cell = document.createElement("td");
      let span = document.createElement("span")
      span.innerHTML = content
      cell.className = "button"
      cell.appendChild(span)
      return cell
    }

    let startLine = document.createElement("tr")
    let startCell;
    switch (status) {
      case lvlStatus.WIN:
        startCell = createTd("Congratulations!");
        startCell.classList.add("greenBg")
        break;
      case lvlStatus.DIE:
        startCell = createTd("You Died!");
        startCell.classList.add("redBg")
        break;
      case lvlStatus.NXT_LVL:
        startCell = createTd("Level Complete!");
        startCell.classList.add("nextLvlBg")
        break;
    }

    startCell.colSpan = 2;
    startLine.appendChild(startCell)
    tab.appendChild(startLine)

    for (const iterator of Object.entries(this.stats)) {
      let line = document.createElement("tr")
      line.appendChild(createTd(iterator[0]))
      line.appendChild(createTd(iterator[1]))
      // cell1.innerHTML = iterator[0]
      // cell2.innerHTML = iterator[1]
      // tab.innerHTML += `<tr><td class="button"><span>${iterator[0]}</span></td><td class="button"><span>${iterator[1]}</span></td></tr>`
      tab.appendChild(line)
    }

    if (status == lvlStatus.NXT_LVL) {
      let nextLvlDescLine = document.createElement("tr")
      let nextLvlDesc = createTd(level_map[level + 1].lvlObjective.description)
      nextLvlDesc.colSpan = 2
      nextLvlDescLine.appendChild(nextLvlDesc)
      tab.appendChild(nextLvlDescLine)
    }
    let endLine = document.createElement("tr")
    let endCell = (status != lvlStatus.NXT_LVL) ? createTd("Main Menu") : createTd("Next Level")
    endCell.colSpan = 2;
    endCell.onclick = () => {
      if (status != lvlStatus.NXT_LVL) {
        scene.menu.restart()
        document.getElementById('endLevelStat').style.display = 'none';
      }
      else {
        scene.menu.inNextLevel = false;
        document.getElementById('endLevelStat').style.display = 'none';
        this.loadNextLevel();
        // engine.runRenderLoop(() => scene.render())
        pointerLock();
        Array.from(document.getElementsByClassName("gameBarsClass")).forEach(e => e.style.display = 'initial')
      }
    }
    endLine.appendChild(endCell)
    tab.appendChild(endLine)
    // tab.innerHTML += "<tr><td class='button' colspan=2 onclick=\"scene.menu.inNextLevel = false;document.getElementById('endLevelStat').style.display = 'none'; engine.runRenderLoop(() => scene.render())\"><span>Next Level</span></td></tr>"
  }

  loadNextLevel() {
    camera.position =
      char1.position
        .multiply(char1.getTurretTank()
          .getDirection(BABYLON.Axis.Z)
          .multiply(new BABYLON.Vector3(50, 50, 50)))
        .add(new BABYLON.Vector3(0, 10, 0))
    level += 1;
    remove_all_objects()
    startgame(level);
    // engine.stopRenderLoop()
  }

  resetValues() {
    Object.keys(this.stats).forEach(e => this.stats[e] = 0)
  }
}
