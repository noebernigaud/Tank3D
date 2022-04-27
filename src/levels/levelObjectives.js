let levelObjectives = {
  killAllTank: {
    description:
      "Complete the next stage by destroying every enemy tank",
    goToNextLevel: (e) => {
      // console.log("HERE", charsAI, chars);
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
  burnAllTrees: {
    description:
      `The ennemies' plantation is their main supplie. These trees are particularly
       inflammable: fire on all the trees on the Island to burn them and complete the stage`,
    goToNextLevel: (e) => {
      return trees.every(tree => (
        tree.isBurning
      ));
    },
    tip: [
      ["Tree to burn", () => `${trees.filter(t => t.isBurning).length}`, () => trees.length]
    ]
  }
}