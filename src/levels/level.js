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
    this.minHeightMap = levelInfo.minHeightMap;
    this.lvlObjective = levelInfo.lvlObjective;
    this.biome = levelInfo.biome;
  }

  canGoNextLevel() {
    return this.lvlObjective.goToNextLevel()
  }

  goNextLevel(died = false, win = false) {
    console.log("in other menu", scene.menu.inOtherMenu());
    if (!scene.menu.inOtherMenu()) {
      scene.menu.inNextLevel = true;
      Array.from(document.getElementsByClassName("gameBarsClass")).forEach(e => e.style.display = 'none')
      exitPointerLoc()
      if (!died && !win) this.loadNextLevel()
      this.writeStat(died, win)
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

  writeStat(die, win) {

    if (win) applauseSound.play()

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
    let startCell = die ? createTd("You Died!") : (win ? createTd("Congratulations!") : createTd("Level Complete!"))
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

    if (!(win || die)) {
      let nextLvlDescLine = document.createElement("tr")
      let nextLvlDesc = createTd(level_map[level].lvlObjective.description)
      nextLvlDesc.colSpan = 2
      nextLvlDescLine.appendChild(nextLvlDesc)
      tab.appendChild(nextLvlDescLine)
    }
    let endLine = document.createElement("tr")
    let endCell = (die || win) ? createTd("Main Menu") : createTd("Next Level")
    endCell.colSpan = 2;
    endCell.onclick = () => {
      if (die || win) {
        scene.menu.restart()
        document.getElementById('endLevelStat').style.display = 'none';
      }
      else {
        scene.menu.inNextLevel = false;
        document.getElementById('endLevelStat').style.display = 'none';
        engine.runRenderLoop(() => scene.render())
        pointerLock()
        Array.from(document.getElementsByClassName("gameBarsClass")).forEach(e => e.style.display = 'initial')
      }
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
