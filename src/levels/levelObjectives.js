let levelObjectives = {
  killAllTank: {
    description: "To pass the following game you have to kill all of the enemies",
    goToNextLevel: (e) => {
      // console.log("HERE", charsAI, chars);

      return chars.length == 1
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
  burnAllTrees: {
    description:
      `The ennemies' plantation is their main supplie. We've equiped you with burning bullets,
      so you can burn all trees on the Island to complete the stage`,
    goToNextLevel: (e) => {
      return trees.forEach(tree => {
        tree.isBurning == true
      });
    }
  }
}