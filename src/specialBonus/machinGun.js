class MachineGun extends SpecialBonus {
  constructor(tank) {
    super(tank, SPECIAL_BONUS_ID.MACHINE_GUN, 10000);
    this.bonusStartedDelay = 10000;
    this.bonusStartedDate = Date.now()
  }


  update() {
    if (Date.now() - this.bonusStartedDate > this.bonusStartedDelay) {
      this.disable()
    }
  }

  isActive() {
    if (this.isActive()) return
    super.activate()
    this.oldSpeed = this.tank.bulletSpeed;
    this.oldDelay = this.tank.tempsMinEntreTirsEnMillisecondes
    this.tank.tempsMinEntreTirsEnMillisecondes = this.oldDelay;
  }

  disable() {
    super.disable()
    this.tank.bulletSpeed = this.oldSpeed;
    this.tank.tempsMinEntreTirsEnMillisecondes = this.oldDelay;
  }

  resetTime() {
    super.resetTime()
    this.bonusStartedDate = Date.now();
  }
}