var button;
var button2;
var button3;

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

    bonusChoice(bonus1, bonus2, bonus3) {
        inMenu = true;
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var panel = new BABYLON.GUI.StackPanel();
        panel.isVertical = false;
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        advancedTexture.addControl(panel);

        var button_bonus1 = BABYLON.GUI.Button.CreateSimpleButton("bonus1", "Bonus 1");
        button_bonus1.width = "100px";
        button_bonus1.height = "40px";
        button_bonus1.color = "white";
        button_bonus1.background = "green";
        button_bonus1.paddingLeft = "5px";
        button_bonus1.paddingRight = "5px";
        panel.addControl(button_bonus1);

        var button_bonus2 = BABYLON.GUI.Button.CreateSimpleButton("bonus2", "Bonus 2");
        button_bonus2.width = "100px";
        button_bonus2.height = "40px";
        button_bonus2.color = "white";
        button_bonus2.background = "green";
        button_bonus2.paddingLeft = "5px";
        button_bonus2.paddingRight = "5px";
        panel.addControl(button_bonus2);

        var button_bonus3 = BABYLON.GUI.Button.CreateSimpleButton("but2", "Right-Top");
        button_bonus3.width = "100px";
        button_bonus3.height = "40px";
        button_bonus3.color = "white";
        button_bonus3.background = "green";
        button_bonus3.paddingLeft = "5px";
        button_bonus3.paddingRight = "5px";
        panel.addControl(button_bonus3);

        button_bonus1.onPointerUpObservable.add(function () {
            button.dispose()
            inMenu = false;
        });
        button_bonus2.onPointerUpObservable.add(function () {
            button.dispose()
            inMenu = false;
        });
        button_bonus2.onPointerUpObservable.add(function () {
            button.dispose()
            inMenu = false;
        });
    }

}