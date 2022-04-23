let levelObjectives = {
  killAllTank: {
    description:
      "Complete the next stage by destroying every enemy tank",
    goToNextLevel: (e) => {
      // console.log("HERE", charsAI, chars);

      return charsAI.length == 0
    }
  },
  getAllBonuses: {
    description:
      `Complete the next stage by picking up all bonus supplied`,
    goToNextLevel: (e) => {
      return bonuses.length == 0
    }
  },
  getBonusesAndKillTanks: {
    description:
      `Complete the next stage by collecting all of the bonus supplied 
      and destroying every enemy tank`,
    goToNextLevel: (e) => {
      return (bonuses.length == 0 && charsAI.length == 0)
    }
  },
  burnAllTrees: {
    description:
      `The ennemies' plantation is their main supplie. These trees are particularly
       inflammable: fire on all the trees on the Island to burn them and complete the stage`,
    goToNextLevel: (e) => {
      return trees.every(tree => (
        tree.isBurning
      ));
    }
  }
}