class BonusEnum {

    static bonusEnumList = [
        new BonusEnum("speed bonus", function () { char1.speedNorme *= 2 }),
        new BonusEnum("reload bullet bonus", function () { char1.delayMinBetweenBullets *= 0.2 }),
        new BonusEnum("bullets speed", function () { char1.bulletSpeed *= 2 }),
        new BonusEnum("bonus life", function () { char1.life += 3 }),
        new BonusEnum("bonus bullet life", function () { char1.bulletLife += 2 }),
    ]

    constructor(name, effect) {
        this.name = name
        this.effect = effect
    }
}