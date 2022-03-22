canTire = true;
// INITIALISATION
function keyListener(evt, isPressed) {
    // tirer
    if (evt.code === "Space") {
        inputStates.mouseclick = isPressed;
    }
    // tourelle
    else if (evt.code === "KeyA") {
        inputStates.keyA = isPressed;
    } else if (evt.code === "KeyD") {
        inputStates.keyD = isPressed;
    }
    // ??
    else if (evt.code === "KeyW") {
        inputStates.keyW = isPressed;
    } else if (evt.code === "KeyS") {
        inputStates.keyS = isPressed;
    }
    // POUR S'ENFLAMER
    else if (evt.code === "KeyL") {
        inputStates.keyL = isPressed;
    }
    // POUR S'ENFLAMER
    else if (evt.code === "KeyX") {
        inputStates.keyX = isPressed;
    }
    // rotation 
    else if (evt.keyCode == 37) {
        inputStates.rot_minus = isPressed;
    } else if (evt.keyCode == 39) {
        inputStates.rot_plus = isPressed;
    }
    // deplacement du char
    else if (evt.keyCode == 38) {
        if (!isPressed) char1.stabilizeTank()
        else if (!inputStates.foreward) char1.stabilizeTank(false)
        inputStates.foreward = isPressed;
    } else if (evt.keyCode == 40) {
        if (!isPressed) char1.stabilizeTank()
        else if (!inputStates.backward) char1.stabilizeTank(false)
        inputStates.backward = isPressed;
    } else if (evt.code == "KeyQ" && canTire) {
        canTire = false
        let length = 1000;
        let ray = new BABYLON.Ray(new BABYLON.Vector3(
            char1.shape.position.x + char1.getTurretTank().getDirection(BABYLON.Axis.Z).x * 10,
            char1.shape.position.y + 3 / 40,
            char1.shape.position.z + char1.getTurretTank().getDirection(BABYLON.Axis.X).x * 10), char1.getTurretTank().getDirection(BABYLON.Axis.Z), length);

        setTimeout(() => canTire = true, 300);
        let pickInfo = scene.pickWithRay(ray, (mesh) => {
            return mesh;
        });
        console.log(pickInfo);
        if (pickInfo.pickedMesh) {
            console.log(pickInfo.pickedMesh.name);
            let bounder = pickInfo.pickedMesh;
        }

        let rayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(scene, new BABYLON.Color3(1, 0, 0));
        setTimeout(() => {
            rayHelper.dispose(ray);
        }, 200);
    }
}

function stabilizeIfNotMoving() {

}

function keyApplaier() {
    var speed_angle = 0.02;

    if (typeof char1.shape === 'undefined') return;

    // On regarde si on doit poser une mine
    if (inputStates.SPACE) {
        char1.addMine(Date.now());
    }
    // On regarde si on doit tirer
    if (inputStates.mouseclick) {
        char1.addBullet(Date.now());
    }

    // TOURNER LE TANK
    if (inputStates.rot_minus && !inputStates.rot_plus) {
        char1.rotateTurretAxisY(-speed_angle, tankMeshes)
        // camera.alpha = -char1.getTurretTank().rotationQuaternion.toEulerAngles().y - Math.PI / 2 - char1.shape.rotationQuaternion.toEulerAngles().y
        char1.rotateAxisY(-speed_angle)

    }
    if (inputStates.rot_plus && !inputStates.rot_minus) {
        char1.rotateTurretAxisY(speed_angle, tankMeshes)
        // camera.alpha = -char1.getTurretTank().rotationQuaternion.toEulerAngles().y - Math.PI / 2 - char1.shape.rotationQuaternion.toEulerAngles().y
        char1.rotateAxisY(speed_angle)
    }
    // TOUNER LA TOURELLE
    if (inputStates.keyA) {
        char1.rotateTurretAxisY(-speed_angle, tankMeshes)
        // camera.alpha = -char1.getTurretTank().rotationQuaternion.toEulerAngles().y - Math.PI / 2 - char1.shape.rotationQuaternion.toEulerAngles().y

    }
    if (inputStates.keyD) {
        char1.rotateTurretAxisY(speed_angle, tankMeshes)
        // camera.alpha = -char1.getTurretTank().rotationQuaternion.toEulerAngles().y - Math.PI / 2 - char1.shape.rotationQuaternion.toEulerAngles().y
    }
    // DEPLACEMENT
    if (inputStates.foreward) {
        char1.moveTankForeward();
        return;
    }
    if (inputStates.backward) {
        char1.moveTankBackward();
        return;
    }
    // destroy
    if (inputStates.keyX) {
        char1.destroyTank(true)

    }
    // destroy
    if (inputStates.keyL) {
        //smoke()
        var smok = createSmoke(char1.shape)
        playSmoke(smok)
        createFire(char1.shape);
    }
}

function init() {
    canvas = document.querySelector("#myCanvas");

    playing = 0;

    level = 0;

    // canvas.addEventListener('mousemove', (evt) => {
    //     mousepos = getMousePos(canvas, evt);
    // }, false);

    // scene.onPointerMove = function (evt) {
    //     mousepos = getMousePos(scene, evt);
    // }, false;

    // window.addEventListener('mousedown', (evt) => {
    //     inputStates.mouseclick = true;
    // });

    // scene.onPointerDown = function (_, _) {
    //     inputStates.mouseclick = true;
    // }, false;

    // scene.onPointerUp = function (_, _0) {
    //     inputStates.mouseclick = false
    // }, false;

    // window.addEventListener('mouseup', (evt) => {
    //     inputStates.mouseclick = false;
    // });

    window.addEventListener('keydown', (evt) => {
        keyListener(evt, true)
    });

    window.addEventListener('keyup', (evt) => {
        keyListener(evt, false)
    });

    // My part
    startgame(level)
    anime();
}

//GAME OVER GO TO MENU

function stopgame() {
    pausebackgroundMusic();
    playing = 0;
}

//DEBUT D'UNE NOUVELLE PARTIE

function startgame(level) {

    playing = 1;

    holes = new Array();
    walls = new Array();
    chars = new Array();
    charsAI = new Array();

    //BULLETS AND MINES INIT
    bullets = new Array();
    mines = new Array();

    if (level < level_map.length) {
        draw_level_map(level)
    } else {
        playing = 2;
        pausebackgroundMusic();
        applauseSound.play();
    }

    // TOP, BOTTOM, RIGHT, LEFT WALLS - ALWAYS HERE NO MATTER THE LEVEL
    // for (var i = 0; i <= cell_x_number; i++) {
    //     //top wall
    //     walls.push(new Wall(i * Wall.width, 0, false));
    //     //bottom wall
    //     walls.push(new Wall(i * Wall.width, cell_y_number * Wall.depth, false));
    // }

    // for (var i = 1; i < cell_y_number; i++) {
    //     //left wall
    //     walls.push(new Wall(0, i * Wall.width, false));
    //     //right wall
    //     walls.push(new Wall(cell_x_number * Wall.depth, i * Wall.width, false));
    // }
}

//BACKGROUND MUSIC

function playBackgroundMusic() {
    let audioPlayer = document.querySelector("#audioPlayer");
    audioPlayer.loop = true;
    audioPlayer.play();
}

function pausebackgroundMusic() {
    let audioPlayer = document.querySelector("#audioPlayer");
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
}

function remove_all_objects() {
    walls.forEach(wall => wall.dispose());
    holes.forEach(hole => hole.dispose());
    bullets.forEach(bullet => bullet.dispose());

    mines.forEach(mine => mine.dispose());
    chars.forEach(char => char.dispose());
}

//ANIMATION

function anime() {

    playing = 1;
    //MENU
    if (playing == 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "50px Arial";
        if (level >= 0) ctx.fillText('You reached level : ' + Math.min((level + 1), 5), 250, 200);
        ctx.fillText('Click the MOUSE or SPACE to start', 100, 350);
        if (inputStates.mouseclick || inputStates.SPACE) {
            level = 0;
            playBackgroundMusic();
            startgame(level);
            inputStates.mouseclick = false;
            inputStates.SPACE = false;
        }
    }

    //CONGRATULATIONS
    if (playing == 2) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "50px Arial";
        ctx.fillText('You have beaten level : ' + level, 240, 100);
        ctx.fillText('Congratulations, you defeated the game!', 70, 200);
        ctx.fillText('Press SPACE', 340, 400);
        ctx.fillText('to go back to main menu', 250, 500);
        if (inputStates.SPACE) {
            playing = 0;
            inputStates.SPACE = false;
        }
    }

    //IN GAME
    if (playing == 1) {

        // bullets.forEach(bullet => bullet.move())
        //Image de fond
        // ctx.drawImage(backgroundTexture, 0, 0, canvas.width, canvas.height);

        //On dessine les murs, trous, mines, balles
        // walls.forEach(wall => wall.draw3d());
        // holes.forEach(hole => hole.draw3d());
        // mines.forEach(mine => mine.draw3d());
        bullets.forEach(bullet => bullet.move());

        // walls.forEach(wall => wall.draw(ctx));
        // holes.forEach(hole => hole.draw(ctx));
        // mines.forEach(mine => mine.draw(ctx));
        // bullets.forEach(bullet => bullet.draw(ctx));

        // 2) On dessine et on déplace les char
        // chars.forEach(char => char.draw3d());

        // chars.forEach(char => char.draw(ctx));
        // charsAI.forEach(char => char.intelligence.applyStrategy(char1));
        // char1.updateAngle(mousepos);

        //VERIFICATION TOUS CHARS ENNEMIS ELIMINES
        if (charsAI.length == 0) {
            level += 1;
            remove_all_objects()
            startgame(level);
        }

        // ctx.font = "30px Arial";
        // ctx.fillText("level: " + (level + 1) + "/5", 10, 30);
    }

    keyApplaier();

    //window.requestAnimationFrame(anime);
}

var inputVitMult = document.getElementById("mutlvit")
if (inputVitMult !== null) inputVitMult.oninput = function () { changeVitesseChar(inputVitMult.value) };

function changeVitesseChar(value) {
    speedMultUti = value;
}

var inputReloadMult = document.getElementById("multReload")
if (inputReloadMult !== null) inputReloadMult.oninput = function () { changeCadenceTir(inputReloadMult.value) };

function changeCadenceTir(value) {
    reloadMultUti = value;
}