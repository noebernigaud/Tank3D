class BonusEnum {

    static bonusEnumList = [
        new BonusEnum("speed bonus", function () { char1.speedNorme *= 2 }),
        new BonusEnum("reload bullet bonus", function () { char1.delayMinBetweenBullets *= 0.2 }),
        new BonusEnum("bullets speed", function () { char1.bulletSpeed *= 2 }),
        new BonusEnum("life", function () { char1.life += 3 }),
    ]

    constructor(name, effect) {
        this.name = name
        this.effect = effect
    }
}