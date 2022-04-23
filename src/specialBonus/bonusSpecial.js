const BONUS_TYPE = {
  PERMANENT: 1,
  ACTIVATION: 2,
  ONE_USE: 3
};

const SPECIAL_BONUS_ID = {
  CROSS_HAIR: 1,
}

class SpecialBonus {

  /** @type{Char} */
  tank;
  /** @type{boolean} */
  isActive;

  /**
   * @param {Char} tank 
   * @param {number} bonusType 
   */
  constructor(tank, bonusType, id) {
    this.tank = tank;
    this.bonusType = bonusType;
    this.isActive = false;
    this.id = id;
    tank.addSpecialBonus(this);
  }

  activate() {
    this.isActive = true;
  }

  disable() {
    this.isActive = false;
  }


  /** Remove bonus from thank but not graphically */
  remove() {
    this.tank.specialBonuses.delete(this);
  }


  /** Remove bonus from thank and graphically */
  fullDispose() {
    this.hide();
    this.remove()
  }

  // ABSTRACT
  update() { }

  /** Remove bonus graphically but not from thank */
  // ABSTRACT
  hide() { }

  /** Load bonus once collected */
  // ABSTRACT
  load() { }

  /**
   * @param {Char} tank 
   */
  static updateAllThankBonuses(tank) {
    tank.specialBonuses.forEach(e => e.update());
  }
}