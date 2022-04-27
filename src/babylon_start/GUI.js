var button;
var button_list;

class Menu {
    constructor() {
        this.canBeSwitched = true;
        this.isFirst = true;
        this.isShown = true;
        this.inBonus = false;
        this.inNextLevel = false;

        this.bonusPanel = document.getElementById("bonusPanel")
        this.nextLevelPanel = document.getElementById("endLevelStat")

        // this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        // this.buttons = []
        // // this.createButton("Play")
        // this.buttons[0].onPointerUpObservable.add(() => {
        //     this.show(false)
        // });

        // // this.createButton("Restart")
        // this.buttons[1].onPointerUpObservable.add(() => {
        //     this.show(false)
        //     level = 0;
        //     remove_all_objects()
        //     startgame(level);
        // });

        this.show(true)
    }

    createButton(name) {
        // let button = BABYLON.GUI.Button.CreateSimpleButton("button" + name, name);

        // button.width = "150px"
        // button.height = "40px";
        // button.color = "white";
        // button.cornerRadius = 20;
        // button.background = "green";
        // button.top = `${(42 * this.buttons.length)}px`

        // this.advancedTexture.addControl(button);
        // this.buttons.push(button)
    }

    show(toShow) {
        if (toShow) {
            exitPointerLoc()
            document.getElementById("main").classList.remove('hide')
        }
        else {
            this.hideMenu()
        }
        if (this.inBonus)
            if (toShow) this.bonusPanel.classList.add('hide')
            else this.bonusPanel.classList.remove('hide')
        this.toggleNotMenuElement(!toShow)
        if (!this.isFirst) {
            document.getElementById("restart").classList.remove('hide')
            if (toShow) {
                chars.forEach(c => c.moveSound.pause())
                engine.stopRenderLoop()
                this.setBackground()
            } else {
                if (!this.inBonus) {
                    musicBackground.play()
                    chars.forEach(c => c.moveSound.play())
                    chars.forEach(e => e.specialBonuses.forEach(b => b.correctTime()))
                    engine.runRenderLoop(() => scene.render())
                }
            }
            this.isShown = toShow
        } else {
            this.prettyBG()
            this.isFirst = false;
        }
    }

    prettyBG() {
        // let src = document.getElementById("src")
        // src.style.backgroundImage = `url('images/tank_bg.jpg')`;
        canvas.classList.add('hide');
        // src.classList.remove('hide')
        // src.style.filter = "blur(0)"
        document.getElementById("main").classList.remove('hide')
    }

    setBackground() {
        if (char1.life <= 0) {
            this.prettyBG()
        } else {

        }
    };

    hideMenu() {
        canvas.classList.remove('hide');
        document.getElementById("src").classList.add('hide')
        document.getElementById("main").classList.add('hide')
    }

    /**
     * @param {BonusEnum[]} bonusListe 
     */
    bonusChoice(bonusListe) {
        exitPointerLoc()
        this.inBonus = true;
        this.bonusPanel.classList.remove('hide')
        /**
         * @param {BonusEnum|SpecialBonus} bEnum 
         * @returns 
        */
        let createButton = (bEnum) => {
            let b = document.createElement("button")
            b.onmouseenter = () => scene.menu.soundHover()

            let span1 = document.createElement("span")
            span1.innerHTML = bEnum.name
            let span2 = document.createElement("span")
            span2.innerHTML = bEnum.description
            span2.classList.add("tooltiptext")

            b.appendChild(bEnum.image)
            b.appendChild(span1)
            b.appendChild(span2)

            b.className = "button tooltip"
            b.onclick = () => {
                bonusTookSound.currentTime = 0
                bonusTookSound.play()
                console.log("bonus was taken");
                bEnum.addToChar()
                this.bonusPanel.classList.add('hide');
                chars.forEach(e => e.specialBonuses.forEach(b => b.correctTime()))
                engine.runRenderLoop(() => scene.render())
                this.inBonus = false;
                this.clearBonus()
                pointerLock()
            }
            this.bonusPanel.appendChild(b);
        }
        bonusListe.forEach(b => createButton(b));
        engine.stopRenderLoop();

        // inMenu = true;
        // let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        // engine.stopRenderLoop();

        // var panel = new BABYLON.GUI.StackPanel();
        // panel.isVertical = false;
        // // panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        // advancedTexture.addControl(panel);

        // bonusListe.forEach(bonus => {
        //     var button_bonus = BABYLON.GUI.Button.CreateSimpleButton("bonus", bonus.name);
        //     button_bonus.width = "400px";
        //     button_bonus.height = "300px";
        //     button_bonus.color = "white";
        //     button_bonus.background = "black";
        //     button_bonus.paddingLeft = "20px";
        //     button_bonus.paddingRight = "20px";
        //     panel.addControl(button_bonus);
        //     button_bonus.onPointerUpObservable.add(function () {
        //         bonus.effect();
        //         selected_bonuses.push(bonus.name);
        //         panel.dispose();
        //         inMenu = false;
        //         engine.runRenderLoop(() => scene.render())
        //     });
        // })
    }

    restart() {
        engine.stopRenderLoop()
        document.getElementsByClassName('specialBonus')[0].classList.add('hide');
        document.getElementById("restart").classList.add('hide')
        scene.menu = new Menu()
        level = 0;
        char1.dispose(true)
        this.clearBonus()
        remove_all_objects()
        startgame(level)
    }

    clearBonus() {
        this.bonusPanel.innerHTML = "";
    }

    soundHover() {
        menuHoverSound.currentTime = 0
        menuHoverSound.play()
    }

    inOtherMenu() {
        return scene.menu.inBonus || scene.menu.inNextLevel
    }

    toggleNotMenuElement(toShow) {
        if (!toShow) Array.from(document.getElementsByClassName("gameBarsClass")).forEach(e => e.classList.add('hide'))
        else {
            if (this.inBonusus) {
                this.bonusPanel.classList.remove('hide')
                Array.from(document.getElementsByClassName("gameBarsClass")).forEach(e => e.classList.remove('hide'))
            }
            else if (this.inNextLevel) this.nextLevelPanel.classList.remove('hide')
            else Array.from(document.getElementsByClassName("gameBarsClass")).forEach(e => e.classList.remove('hide'))
        }
    }

    isInMenu() {
        return this.isShown || this.inOtherMenu()
    }

}
