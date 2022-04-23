const BONUS_TYPE = {
  PERMANENT: 1,
  ACTIVATION: 2,
  ONE_USE: 3
};

const SPECIAL_BONUS_ID = {
  CROSS_HAIR: {
    name: "Sniper laser",
    description: "Highlight enemies once target + Bullet are very fast every 3 seconds",
    image: "images/gunaims.png",
    keyListener: '1'
  },
}

class SpecialBonus {
  /** @type{Char} */
  tank;

  /** @type{boolean} */
  isActive;

  /** @type{HTMLDivElement} */
  loader;

  /**
   * @param {Char} tank 
   */
  constructor(tank, bonusType) {
    this.tank = tank;
    this.bonusType = bonusType;
    this.isActive = false;

    this.name = bonusType.name;
    this.description = bonusType.description;

    this.image = document.createElement("img");
    this.image.src = bonusType.image
    this.image.classList.add("logo")
    this.image.classList.add("whiteBackground")

    this.delay = 10000;
    this.timeCooled = 10000;
    this.startDate = Date.now()
  }

  addToChar() {
    this.tank.addSpecialBonus(this);
  }

  activate() {
    this.isActive = true;
  }

  disable() {
    this.isActive = false;
  }


  /** Remove bonus from thank but not graphically */
  remove() {
    this.tank.specialBonuses.splice(this.tank.specialBonuses.indexOf(this), 1);
  }


  /** Remove bonus from thank and graphically */
  fullDispose() {
    this.hide();
    this.remove();
    if (this.tank == char1) this.bg.remove();
  }

  update() {
    this.timeCooled = Math.max(0, this.startDate + this.delay - Date.now());
    let timeDisplay = 100 - Math.round(100 - this.timeCooled / this.delay * 100)
    this.loader.style.setProperty('--p', `${timeDisplay}`);
    this.loader.innerHTML = timeDisplay > 0 ? (timeDisplay + "%") : ""
  }

  /** Remove bonus graphically but not from thank */
  // ABSTRACT
  hide() { }

  /** Load bonus once collected */
  // ABSTRACT
  load() {

    this.loader = document.createElement('div')
    this.loader.classList = "pie animate no-round"
    this.loader.style.setProperty("--p", '0')
    this.loader.innerHTML = "0%";

    this.shortcut = document.createElement('div')
    this.shortcut.innerHTML = this.bonusType.keyListener;
    this.shortcut.classList = 'shortcut'

    this.bg = document.createElement('div')
    this.bg.classList = 'bg'
    this.bg.style.setProperty("--img", `url("../${this.bonusType.image}")`)

    this.bg.appendChild(this.loader);
    this.bg.appendChild(this.shortcut);

    if (this.tank == char1) {
      let sb = document.getElementsByClassName('specialBonus')[0]
      sb.appendChild(this.bg);
      sb.classList.remove('hide')
    }
  }

  /** Apply the effect of the bonus if possible */
  use() {
    if (this.timeCooled > 0) return false;
    this.startDate = Date.now()
    this.timeCooled = this.delay;
    return true;
  }

  /**
   * KeyListener specific to each bonus 
   * @param {KeyboardEvent} event 
   */
  applyListener(event) {
    if (event.key == this.bonusType.keyListener) this.use()
  }

  resetTime() {
    this.startDate = Date.now()
    this.timeCooled = 0;
  }

  correctTime() {
    this.startDate = Date.now() - this.delay + this.timeCooled
  }

  /**
   * @param {Char} tank 
   */
  static updateAllThankBonuses(tank) {
    tank.specialBonuses.forEach(e => e.update());
  }

  static createSpecialBonusList(tank) {
    return [
      new crossHair(tank),
      new crossHair(tank),
      new crossHair(tank),
      new crossHair(tank),
      new crossHair(tank)
    ]
  }
}