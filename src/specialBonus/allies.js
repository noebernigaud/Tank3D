class Allies extends SpecialBonus {
    constructor(tank) {
        super(tank, SPECIAL_BONUS_ID.ALLIES, 30000);
    }

    use() {
        if (super.use()) {
            var allie1 = new Char("normal", 5, 5, 0, 1, 2000, 40, 1, 1, 5, 3);
            allie1.shape.position.y += 3
            charsAllies.push(allie1);
            allie1.setStrategy(new guaranteedAI(allie1, false))
            chars.push(allie1);

            // var allie2 = new Char("normal", 3, 3, 0, 1, 2000, 40, 1, 1, 5, 3);
            // allie2.shape.position.y += 3
            // charsAllies.push(allie2);
            // allie2.setStrategy(new guaranteedAI(allie2, false))
            // chars.push(allie2);
        }

    }
}