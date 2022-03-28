var button;
var button_list;

class Menu {
    constructor() {
        this.createButton();
    }

    createButton() {
        inMenu = true;
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let button1 = BABYLON.GUI.Button.CreateSimpleButton("button1", "Play");

        button = button1;
        button1.width = "150px"
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        button1.onPointerUpObservable.add(function () {
            button.dispose()
            inMenu = false;
        });
        advancedTexture.addControl(button1);
    }

    bonusChoice(bonusListe) {
        inMenu = true;
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        engine.stopRenderLoop();

        var panel = new BABYLON.GUI.StackPanel();
        panel.isVertical = false;
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        advancedTexture.addControl(panel);

        bonusListe.forEach(bonus => {
            var button_bonus = BABYLON.GUI.Button.CreateSimpleButton("bonus", bonus);
            button_bonus.width = "400px";
            button_bonus.height = "300px";
            button_bonus.color = "white";
            button_bonus.background = "black";
            button_bonus.paddingLeft = "20px";
            button_bonus.paddingRight = "20px";
            panel.addControl(button_bonus);
            button_bonus.onPointerUpObservable.add(function () {
                char1.speedNorme *= 2
                panel.dispose();
                inMenu = false;
                engine.runRenderLoop(() => scene.render())
            });
        })
    }

}