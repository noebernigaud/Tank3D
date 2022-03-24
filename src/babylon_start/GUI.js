class Menu {
    constructor() {
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        this.button1 = BABYLON.GUI.Button.CreateSimpleButton("button1", "Play");
        this.button1.width = "150px"
        this.button1.height = "40px";
        this.button1.color = "white";
        this.button1.cornerRadius = 20;
        this.button1.background = "green";
        this.button1.onPointerUpObservable.add(function () {
            alert("you did it!");
        });
        this.advancedTexture.addControl(this.button1);
    }

}