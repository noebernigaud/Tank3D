class Menu {
    canBeSwitched = true;
    isFirst = true;
    isReallyFirst = true;
    constructor() {
        this.isShown = true;

        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        this.buttons = []
        this.createButton("Play")
        this.buttons[0].onPointerUpObservable.add(() => {
            this.show(false)
        });

        this.createButton("Restart")
        this.buttons[1].onPointerUpObservable.add(() => {
            this.show(false)
            level = 0;
            remove_all_objects()
            startgame(level);
        });

        this.show(true, true)
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

    takeScreenshot() {
        if (char1.life <= 0) {
            this.prettyBG()
        } else
            BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, { width: canvas.width, height: canvas.height }, function (data) {
                document.getElementById("src").style.backgroundImage = `url('${data}')`;
                canvas.style.display = "none";
                document.getElementById("src").style.display = "block"
                document.getElementById("main").style.display = "block"
                document.getElementById("src").style.filter = "blur(5px)"
            });
    };

    hideMenu() {
        canvas.style.display = "block";
        document.getElementById("src").style.display = "none"
        document.getElementById("main").style.display = "none"
    }

}