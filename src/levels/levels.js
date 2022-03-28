const level_map = [

    // [
    //   "-----------------------",
    //   "-----------------------",
    //   "------h------h---------",
    //   "-----------------------",
    //   "-----------------------",
    //   "-----------------------",
    //   "-----P------------R----",
    //   "-----------------------",
    //   "-----------------------",
    //   "-----------------------",
    //   "-----------------------",
    //   "-----------------------",
    //   "-----------------------",
    // ],
    [
        "-----------------------",
        "-----------------------",
        "------h----------------",
        "-----------------------",
        "-----------------------",
        "--------W--W-----------",
        "-----P-----w------R----",
        "-----------w-----------",
        "--------W--W-----------",
        "-----c-----------------",
        "-----------------------",
        "-----------------------",
        "-----------------------",
    ],
    [
        "-----------------------",
        "-----------------------",
        "--------------------R--",
        "----WWWWWWWWwww--------",
        "-----------------------",
        "-----------------------",
        "------------c----------",
        "-----------------------",
        "-----------------------",
        "--------wwwWWWWWWWW----",
        "-----------------------",
        "--P--------------------",
        "-----------------------",
    ],
    [
        "-----------------------",
        "-------B---------------",
        "---WWwwwwwwW-------c---",
        "-----------W-----------",
        "-----------W-----------",
        "-----------W-----------",
        "-----------WW-----R----",
        "------------W----------",
        "------------W----------",
        "------------W----------",
        "--P---------WwwwwwwWW--",
        "-----------------------",
        "------------------B----",
    ],
    [
        "----------h------h-----",
        "---c------h---B--h--B--",
        "----------h------h-----",
        "hhhhhhh---h------------",
        "----------h------------",
        "----------h--hhhhhhhhhh",
        "----------h-------B----",
        "-----------------------",
        "------------B--h-------",
        "hhhhhhhhhhh----h-------",
        "--P------------h---hhhh",
        "----------h----h-------",
        "----------h----h-------",
    ],
    [
        "-----------------------",
        "---WWWWW-------W----G--",
        "---W-----------W-------",
        "---W-B---------W-------",
        "---W-----------W-------",
        "---W-----------WWWWW---",
        "-----------c-----------",
        "-----------------------",
        "---WWWWWW----------W---",
        "--------W----------W---",
        "--P-----W----------W---",
        "--------W------WWWWW-R-",
        "-----------------------",
    ],
]


/**
 * @param {number} lvl_number 
 */
function draw_level_map(lvl_number) {
    current_level = level_map[lvl_number];
    //char1 = new Char(ObjectEnum.Player, 0, 0, 0, 3 * speedMultUti, 800 * reloadMultUti, 40);

    if (lvl_number == 0) {
        char1 = new Char(ObjectEnum.Player, 0, 0, 0, 3 * speedMultUti, 800 * reloadMultUti, 40);
        selected_bonuses = []
    }
    let widthOffset = (cell_x_number - current_level.length) / 2
    let heightOffset = (cell_y_number - current_level[0].length) / 2
    for (var [l_index, line] of current_level.entries()) {
        for (var [ch_index, ch] of line.split('').entries()) {
            var posX = (ch_index + 1) * cell_size + widthOffset;
            var posY = (current_level.length - l_index) * cell_size + widthOffset;
            switch (ch) {
                case '-':
                    break;
                case 'R':
                    var char = new Char(ObjectEnum.CharRed, posX, posY, 0, 3, 2000, 40);
                    charsAI.push(char);
                    char.setStrategy(new guaranteedAI(char))
                    chars.push(char);

                    char.applyStrategy()
                    break;
                case 'B':
                    var char = new Char(ObjectEnum.CharBlue, posX, posY, 0, 3, 10000, 20);
                    charsAI.push(char);
                    chars.push(char);
                    char.setStrategy(new guaranteedAI(char))
                    char.applyStrategy()
                    break;
                case 'G':
                    var char = new Char(ObjectEnum.CharGreen, posX, posY, 0, 3, 4000, 10);
                    charsAI.push(char);
                    chars.push(char);
                    char.setStrategy(new guaranteedAI(char))
                    char.applyStrategy()
                    break;
                case 'W':
                    walls.push(new Wall(posX, posY, false));
                    break;
                case 'w':
                    walls.push(new Wall(posX, posY, true));
                    break;
                case 'c':
                    bonuses.push(new Bonus(posX, posY));
                    break;
                case 'P':
                    char1.shape.position = new BABYLON.Vector3(-width / 2 + posX, Char.height / 2, -height / 2 + posY)
                    // char1 = new Char(ObjectEnum.Player, posX, posY, 0, 3 * speedMultUti, 800 * reloadMultUti, 40);
                    chars.push(char1);
                    // camera.target = char1.getTurretTank();
                    char1.shape.rotate(BABYLON.Axis.Y, Math.PI / 2)
                    // camera.alpha -= Math.PI / 2
                    break;
                case 'h':
                    holes.push(new Hole(posX, posY))
                    break;
            }
        }
    }

    tanksAIReady = true;

    // Creation de l'enceinte 
    walls.push(new WallPerimeter(-width / 2, 0, 1, height + 1))
    walls.push(new WallPerimeter(width / 2, 0, 1, height + 1))
    walls.push(new WallPerimeter(0, height / 2, width - 1, 1))
    walls.push(new WallPerimeter(0, -height / 2, width - 1, 1))

}