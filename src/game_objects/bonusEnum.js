class BonusEnum {

    static bonusEnumList = [
        new BonusEnum(
            "Speed",
            function () { char1.speedNorme += 1.5 },
            "Acceleration multiplied by 2",
            "./images/speed_tank.png"
        ),
        new BonusEnum(
            "Reload bullet",
            function () { if (char1.delayMinBetweenBullets >= 100) char1.delayMinBetweenBullets -= 100 },
            "The delay between shoots is faster",
            "./images/reload_bullet.png"
        ),
        new BonusEnum(
            "Bullets speed",
            function () { char1.bulletSpeed += 20 },
            "Now your bullets will go two time faster !",
            "./images/speed_bullet.png"
        ),
        new BonusEnum(
            "Bonus bullet damage",
            function () { char1.bulletDamage += 3 },
            "With this bonus your bullets will deal 5 more damage",
            "./images/bullet_damage.png"
        ),
        new BonusEnum(
            "Bonus char health",
            function () {
                char1.maxHealth += 5
                char1.health += 5
            },
            "With this bonus your char gains 5 maximum health",
            "./images/health.png"
        ),
    ]

    constructor(name, load, description, image) {
        this.name = name
        this.load = load
        this.description = description;
        this.image = document.createElement("img");
        this.image.src = image
        this.image.classList.add("logo")
        this.image.classList.add("whiteBackground")
    }

    addToChar() {
        selected_bonuses.push(this.name);
        this.load()
    }
}