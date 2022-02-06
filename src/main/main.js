// INITIALISATION
function keyListener(evt, is_true) {
    if (evt.code === "Space") {
        inputStates.mouseclick = is_true;
    }
    else if (evt.code === "KeyA") {
        inputStates.keyA = is_true;
    }
    else if (evt.code === "KeyW") {
        inputStates.keyW = is_true;
    }
    else if (evt.code === "KeyS") {
        inputStates.keyS = is_true;
    }
    else if (evt.code === "KeyD") {
        inputStates.keyD = is_true;
    }
    else if (evt.code === "KeyL") {
        inputStates.keyL = is_true;
    }
    else if (evt.code === "KeyX") {
        inputStates.keyX = is_true;
    }
    else if (evt.keyCode == 37) {
        inputStates.rot_minus = is_true;
    }
    else if (evt.keyCode == 38) {
        inputStates.foreward = is_true;
    }
    else if (evt.keyCode == 39) {
        inputStates.rot_plus = is_true;
    }
    else if (evt.keyCode == 40) {
        inputStates.backward = is_true;
    }
}

function keyApplaier() {
    var speed_angle = 0.02;

    if (typeof tankContainer === 'undefined') return;

    // On regarde si on doit poser une mine
    if (inputStates.SPACE) {
        char1.addMine(Date.now());
    }
    // On regarde si on doit tirer
    if (inputStates.mouseclick) {
        char1.addBullet(Date.now());
    }

    //DEPLACEMENTS DU CHAR
    var coeff = 1;
    if (inputStates.keyA + inputStates.keyW + inputStates.keyS + inputStates.keyD >= 2) coeff = 0.7;

    if (inputStates.rot_minus && !inputStates.rot_plus) {
        rotateTurretAxisY(-speed_angle, tanksMeshes)
        camera.alpha += speed_angle
    }

    if (inputStates.rot_plus && !inputStates.rot_minus) {
        rotateTurretAxisY(speed_angle, tanksMeshes)
        camera.alpha -= speed_angle
    }

    if (inputStates.keyA) {
        rotateAxisY(-speed_angle)

    }
    if (inputStates.keyD) {
        rotateAxisY(speed_angle)
    }

    if (inputStates.foreward) {
        moveTankForeward();
        return;
    }
    if (inputStates.backward) {
        moveTankBackward();
        return;
    }
    if (inputStates.keyX) {
        explode()
        tanksMeshes.forEach(e => e.setParent(null))
        tanksMeshes.forEach(e => e.physicsImpostor = new BABYLON.PhysicsImpostor(e, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }));

        tankContainer.dispose()
    }
    if (inputStates.keyL) {
        //smoke()
        var smok = createSmoke(tankContainer)
        playSmoke(smok)
    }
    else {
        stabilizeTank()

        char1.physicsImpostor.setLinearVelocity(
            new BABYLON.Vector3(0, 0, 0));
        char1.physicsImpostor.setAngularVelocity(
            new BABYLON.Vector3(0, 0, 0))
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

    //TOP, BOTTOM, RIGHT, LEFT WALLS - ALWAYS HERE NO MATTER THE LEVEL
    for (var i = 0; i <= cell_x_number; i++) {
        //top wall
        walls.push(new Wall(i * Wall.width, 0, false));
        //bottom wall
        walls.push(new Wall(i * Wall.width, cell_y_number * Wall.depth, false));
    }

    for (var i = 1; i < cell_y_number; i++) {
        //left wall
        walls.push(new Wall(0, i * Wall.width, false));
        //right wall
        walls.push(new Wall(cell_x_number * Wall.depth, i * Wall.width, false));
    }
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

    window.requestAnimationFrame(anime);
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