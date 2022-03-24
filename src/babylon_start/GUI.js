var button;
class Menu {
    constructor() {
        this.createButton();
    }

    createButton() {
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
            engine.runRenderLoop(() => scene.render())
        });
        advancedTexture.addControl(button1);
    }

}