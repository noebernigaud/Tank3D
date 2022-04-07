class BonusEnum {

    static bonusEnumList = [
        new BonusEnum(
            "Speed",
            function () { char1.speedNorme *= 2 },
            "Acceleration multiplied by 2"),
        new BonusEnum(
            "Reload bullet",
            function () { if (char1.delayMinBetweenBullets >= 100) char1.delayMinBetweenBullets -= 100 },
            "The delay between shoots is faster"),
        new BonusEnum(
            "Bullets speed",
            function () { char1.bulletSpeed *= 2 },
            "Now your bullets will go two time faster !"),
        new BonusEnum(
            "Bonus life",
            function () { char1.life += 3 },
            "With this bonus you gain 3 lives"),
        new BonusEnum(
            "Bonus bullet damage",
            function () { char1.bulletDamage += 5 },
            "With this bonus your bullets will deal 5 more damage"),
        new BonusEnum(
            "Bonus char health",
            function () {
                char1.maxHealth += 5
                char1.health += 5
            },
            "With this bonus your char gains 5 maximum health"),
    ]

    constructor(name, effect, description) {
        this.name = name
        this.effect = effect
        this.description = description;
    }
}