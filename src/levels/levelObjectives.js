let levelObjectives = {
  killAllTank: {
    description: "To pass the following game you have to kill all of the enemies",
    goToNextLevel: (e) => {
      // console.log("HERE", charsAI, chars);

      return charsAI.length == 0
    }
  },
  getAllBonuses: {
    description:
      `To pass the following game you have to collect all of the bonuses, be careful : 
      An enemy can pick a bonus and to get it back you must kill him`,
    goToNextLevel: (e) => {
      return bonuses.length == 0
    }
  },
  getBonusesAndKillTanks: {
    description:
      `To pass the following game you have to collect all of the bonuses and destroy
      every enemy tank`,
    goToNextLevel: (e) => {
      return (bonuses.length == 0 && charsAI.length == 0)
    }
  },
  burnAllTrees: {
    description:
      `The ennemies' plantation is their main supplie. These trees are particularly inflammable:
      fire on all the trees on the Island to burn them and complete the stage`,
    goToNextLevel: (e) => {
      return trees.every(tree => (
        tree.isBurning
      ));
    }
  }
}