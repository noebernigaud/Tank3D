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
            button_bonus.width = "150px";
            button_bonus.height = "150px";
            button_bonus.color = "white";
            button_bonus.background = "green";
            button_bonus.paddingLeft = "5px";
            button_bonus.paddingRight = "5px";
            panel.addControl(button_bonus);
            button_bonus.onPointerUpObservable.add(function () {
                char1.speedNorme *= 2
                panel.dispose();
                inMenu = false;
                engine.runRenderLoop(() => scene.render())
            });
        })



        // var button_bonus1 = BABYLON.GUI.Button.CreateSimpleButton("bonus1", "Bonus 1");
        // button = button_bonus1;
        // button_bonus1.width = "100px";
        // button_bonus1.height = "40px";
        // button_bonus1.color = "white";
        // button_bonus1.background = "green";
        // button_bonus1.paddingLeft = "5px";
        // button_bonus1.paddingRight = "5px";
        // panel.addControl(button_bonus1);

        // var button_bonus2 = BABYLON.GUI.Button.CreateSimpleButton("bonus2", "Bonus 2");
        // button2 = button_bonus2;
        // button_bonus2.width = "100px";
        // button_bonus2.height = "40px";
        // button_bonus2.color = "white";
        // button_bonus2.background = "green";
        // button_bonus2.paddingLeft = "5px";
        // button_bonus2.paddingRight = "5px";
        // panel.addControl(button_bonus2);

        // var button_bonus3 = BABYLON.GUI.Button.CreateSimpleButton("but2", "Bonus 3");
        // button3 = button_bonus3;
        // button_bonus3.width = "100px";
        // button_bonus3.height = "40px";
        // button_bonus3.color = "white";
        // button_bonus3.background = "green";
        // button_bonus3.paddingLeft = "5px";
        // button_bonus3.paddingRight = "5px";
        // panel.addControl(button_bonus3);

        // button_bonus1.onPointerUpObservable.add(function () {
        //     char1.speedNorme *= 2
        //     button.dispose()
        //     button2.dispose()
        //     button3.dispose()
        //     inMenu = false;
        //     engine.runRenderLoop(() => scene.render())
        // });
        // button_bonus2.onPointerUpObservable.add(function () {
        //     char1.speedNorme *= 2
        //     button.dispose()
        //     button2.dispose()
        //     button3.dispose()
        //     inMenu = false;
        //     engine.runRenderLoop(() => scene.render())
        // });
        // button_bonus3.onPointerUpObservable.add(function () {
        //     char1.speedNorme *= 2
        //     button.dispose()
        //     button2.dispose()
        //     button3.dispose()
        //     inMenu = false;
        //     engine.runRenderLoop(() => scene.render())
        // });
    }

}