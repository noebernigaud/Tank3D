var button;
var button_list;

class Menu {
    constructor() {
        this.canBeSwitched = true;
        this.isFirst = true;
        this.isReallyFirst = true;
        this.isShown = true;
        this.inBonus = false;

        this.bonusPanel = document.getElementById("bonusPanel")

        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
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
        if (toShow) document.getElementById("main").style.display = "block"
        else this.hideMenu()
        if (this.inBonus)
            if (toShow) this.bonusPanel.style.display = "none"
            else this.bonusPanel.style.removeProperty("display")
        toggleNotMenuElement(!toShow)
        if (!this.isFirst) {
            document.getElementById("restart").style.removeProperty("display")
            if (toShow) {
                engine.stopRenderLoop()
                this.setBackground()
            } else {
                if (!this.inBonus) {
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
        let src = document.getElementById("src")
        src.style.backgroundImage = `url('images/tank_bg.jpg')`;
        canvas.style.display = "none";
        src.style.display = "block"
        src.style.filter = "blur(0)"
        document.getElementById("main").style.display = "block"
    }

    setBackground() {
        if (char1.life <= 0) {
            this.prettyBG()
        } else {

        }
    };

    hideMenu() {
        canvas.style.display = "block";
        document.getElementById("src").style.display = "none"
        document.getElementById("main").style.display = "none"
    }

    /**
     * @param {BonusEnum[]} bonusListe 
     */
    bonusChoice(bonusListe) {
        exitPointerLoc()
        this.inBonus = true;
        this.bonusPanel.style.removeProperty("display")
        /**
         * @param {BonusEnum} bEnum 
         * @returns 
        */
        let createButton = (bEnum) => {
            let b = document.createElement("button")
            b.onmouseenter = () => scene.menu.soundHover()
            b.innerHTML = `<span>${bEnum.name}</span><span class="tooltiptext">${bEnum.description}</span>`;
            b.className = "button tooltip"
            b.onclick = () => {
                bonusTookSound.currentTime = 0
                bonusTookSound.play()
                console.log("bonus was taken");
                bEnum.effect()
                selected_bonuses.push(bEnum.name);
                this.bonusPanel.style.display = "none";
                engine.runRenderLoop(() => scene.render())
                this.inBonus = false;
                this.clearBonus()
                canvas.requestPointerLock()
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
        document.getElementById("restart").style.display = "none"
        scene.menu = new Menu()
        level = 0;
        remove_all_objects()
        this.clearBonus()
    }

    clearBonus() {
        this.bonusPanel.innerHTML = "";
    }

    soundHover() {
        menuHoverSound.currentTime = 0
        menuHoverSound.play()
    }
}

function toggleNotMenuElement(toShow) {
    Array.from(document.getElementsByClassName("hideOnMenu")).forEach(e => {
        if (toShow) e.style.display = "initial"
        else e.style.display = "none"
    })
}
