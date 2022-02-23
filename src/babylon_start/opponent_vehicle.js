function destroyOpponent(isDisabled) {
    if (isDisabled) {
        explode(opponentContainer);
        var smok = createSmoke(opponentContainer);
        playSmoke(smok);
        createFire(opponentContainer);
        opponentMaterials.forEach(m => m.emissiveColor = new BABYLON.Color3(0, 0, 0));
    }
}