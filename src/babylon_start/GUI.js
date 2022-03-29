var button;
var button_list;

class Menu {
    constructor() {
        this.createButton();
    }

    createButton(name) {
        let button = BABYLON.GUI.Button.CreateSimpleButton("button" + name, name);

        button.width = "150px"
        button.height = "40px";
        button.color = "white";
        button.cornerRadius = 20;
        button.background = "green";
        button.top = `${(42 * this.buttons.length)}px`

        this.advancedTexture.addControl(button);
        this.buttons.push(button)
    }

    show(toShow) {
        if (!this.isFirst) {

            if (toShow) {
                engine.stopRenderLoop()
                this.takeScreenshot()
            }
            else {
                if (!this.isReallyFirst) {
                    engine.runRenderLoop(() => scene.render())

                } else this.isReallyFirst = false
                this.hideMenu()

            }

            this.buttons.forEach(e => e.isVisible = toShow)
            this.isShown = toShow
            chars.forEach(e => e.stabilizeTank(toShow))
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

    bonusChoice(bonusListe) {
        inMenu = true;
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        engine.stopRenderLoop();

        var panel = new BABYLON.GUI.StackPanel();
        panel.isVertical = false;
        // panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        advancedTexture.addControl(panel);

        bonusListe.forEach(bonus => {
            var button_bonus = BABYLON.GUI.Button.CreateSimpleButton("bonus", bonus.name);
            button_bonus.width = "400px";
            button_bonus.height = "300px";
            button_bonus.color = "white";
            button_bonus.background = "black";
            button_bonus.paddingLeft = "20px";
            button_bonus.paddingRight = "20px";
            panel.addControl(button_bonus);
            button_bonus.onPointerUpObservable.add(function () {
                bonus.effect();
                selected_bonuses.push(bonus.name);
                panel.dispose();
                inMenu = false;
                engine.runRenderLoop(() => scene.render())
            });
        })
    }

}