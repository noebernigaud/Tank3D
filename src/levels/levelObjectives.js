let levelObjectives = {
  killAllTank: {
    description:
      "Complete the next stage by destroying every enemy tank",
    goToNextLevel: (e) => {
      return charsAI.length == 0
    },
    tip: [
      ["Tank to kill", () => charsDestroyed.length, () => charsDestroyed.length + charsAI.length]
    ]
  },
  getAllBonuses: {
    description:
      `Complete the next stage by picking up all bonus supplied`,
    goToNextLevel: (e) => {
      return bonuses.length == 0
    },
    tip: [["Bonus to collect", () => current_level_dico.getBonusObtained(),
      () => bonuses.length + current_level_dico.getBonusObtained()]]
  },
  getBonusesAndKillTanks: {
    description:
      `Complete the next stage by collecting all of the bonus supplied 
      and destroying every enemy tank`,
    goToNextLevel: (e) => {
      return (bonuses.length == 0 && charsAI.length == 0)
    },
    tip: [
      ["Bonus to collect", () => current_level_dico.getBonusObtained(),
        () => bonuses.length + current_level_dico.getBonusObtained()],
      ["Tank to kill", () => charsDestroyed.length,
        () => charsDestroyed.length + charsAI.length]
    ]
  },
  burnAllBarrels: {
    description:
      `Destroy all the essence barrels to cut down ennemies' supplies`,
    goToNextLevel: (e) => {
      return barrels.every(barrel => (
        barrel.isBurning
      ));
    },
    tip: [
      ["Barrels to burn", () => `${barrels.filter(b => b.isBurning).length}`, () => barrels.length]
    ]
  }
}