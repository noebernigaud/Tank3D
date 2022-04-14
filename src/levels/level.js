class Level {
  stats = {
    "Char Killed": 0,
    "Bonus Obteined": 0,
    "Bullet Fired": 0,
    "Total Distance": 0,
    "Wall destroyed": 0
  }

  constructor(levelInfo) {
    this.level = levelInfo.level;
    this.sol = levelInfo.sol;
    this.minHeightMap = levelInfo.minHeightMap;
    this.lvlObjective = levelInfo.lvlObjective;
  }

  canGoNextLevel() {
    return this.lvlObjective.goToNextLevel()
  }

  goNextLevel() {
    console.log("in other menu", scene.menu.inOtherMenu());
    if (!scene.menu.inOtherMenu()) {
      scene.menu.inNextLevel = true;
      Array.from(document.getElementsByClassName("gameBarsClass")).forEach(e => e.style.display = 'none')
      exitPointerLoc()
      this.loadNextLevel()
      this.writeStat()
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
    this.stats["Bonus Obteined"]++;
  }

  addWallDestroyed() {
    this.stats["Wall destroyed"]++;
  }

  writeStat() {
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
    for (const iterator of Object.entries(this.stats)) {
      let line = document.createElement("tr")
      line.appendChild(createTd(iterator[0]))
      line.appendChild(createTd(iterator[1]))
      // cell1.innerHTML = iterator[0]
      // cell2.innerHTML = iterator[1]
      // tab.innerHTML += `<tr><td class="button"><span>${iterator[0]}</span></td><td class="button"><span>${iterator[1]}</span></td></tr>`
      tab.appendChild(line)
    }
    let endLine = document.createElement("tr")
    let endCell = createTd("Next Level")
    endCell.colSpan = 2;
    endCell.onclick = () => {
      scene.menu.inNextLevel = false;
      document.getElementById('endLevelStat').style.display = 'none';
      engine.runRenderLoop(() => scene.render())
      pointerLock()
      Array.from(document.getElementsByClassName("gameBarsClass")).forEach(e => e.style.display = 'initial')
    }
    endLine.appendChild(endCell)
    tab.appendChild(endLine)
    // tab.innerHTML += "<tr><td class='button' colspan=2 onclick=\"scene.menu.inNextLevel = false;document.getElementById('endLevelStat').style.display = 'none'; engine.runRenderLoop(() => scene.render())\"><span>Next Level</span></td></tr>"
  }

  loadNextLevel() {
    level += 1;
    remove_all_objects()
    startgame(level);
    engine.stopRenderLoop()
  }
}
