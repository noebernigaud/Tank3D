const level_map = [
    // {
    //     level: [
    //         "----------h------h-----",
    //         "----------h---B--h--B--",
    //         "----------h------h-----",
    //         "hhhhhhh---h------------",
    //         "----------h------------",
    //         "----------h--hhhhhhhhhh",
    //         "----------h-------B----",
    //         "-----------------------",
    //         "------------B--h-------",
    //         "hhhhhhhhhhh----h-------",
    //         "--P------------h---hhhh",
    //         "----------h----h-------",
    //         "----------h----h-------",
    //     ],
    //     sol: "textures/ground_diffuse.png",
    //     minHeightMap: -1,
    // },
    // {
    //     level:
    //         [
    //             "---------------",
    //             "---------------",
    //             "--P--------N---",
    //             "------c--------",
    //             "---------------",
    //         ],
    //     sol: "textures/ground_diffuse8k.png",
    //     minHeightMap: -0.1,
    // },
    new Level({
        level:
            [
                "---t-----------------t------t",
                "-----------r-----------------",
                "---------------t-----r-------",
                "------t----------------------",
                "-----------------------------",
                "---------h--------r-----t----",
                "----t------------------------",
                "-------------t---------------",
                "-----------W--W--------------",
                "--------P-----w--------------",
                "--------------w--------------",
                "----r------W--W----------G---",
                "-----------------t-----------",
                "---------c-------------------",
                "-----------------------------",
                "----------t-----------r------",
                "-----t-----------------------",
                "-----------------t-----------",
                "-t-------r----------------t--",
            ],
        sol: "textures/ground_diffuse.png",
        minHeightMap: -0.1,
        lvlObjective: levelObjectives.getAllBonuses,
    }),
    new Level({
        level:
            [
                "--t----------------t---",
                "------------t----------",
                "------h-----------t----",
                "-t------------t--------",
                "------t----------t-----",
                "--------W--W-----------",
                "-----P-----w------R----",
                "-----------w-----------",
                "--t-----W--W---t-------",
                "------------t----------",
                "------c-----------t----",
                "----------t------------",
                "--t----------------t---",
            ],
        sol: "textures/ground_diffuse.png",
        minHeightMap: -0.1,
        lvlObjective: levelObjectives.killAllTank,
    }),
    new Level({
        level: [
            "-----------------------",
            "-----------------------",
            "--------------------R--",
            "----WWWWWWWWwww--------",
            "-----------------------",
            "-----------------------",
            "-----------------------",
            "-----------------------",
            "-----------------------",
            "--------wwwWWWWWWWW----",
            "-----------------------",
            "--P--------------------",
            "-----------------------",
        ],
        sol: "textures/ground.png",
        minHeightMap: -1,
        lvlObjective: levelObjectives.killAllTank,
    }),
    new Level({
        level: [
            "----------h------h-----",
            "----------h---B--h--B--",
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
        sol: "textures/ground_diffuse.png",
        minHeightMap: -1,
        lvlObjective: levelObjectives.killAllTank,
    }),
    new Level({
        level: [
            "-----------------------",
            "-------B---------------",
            "---WWwwwwwwW-----------",
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
        sol: "textures/ground_diffuse.png",
        minHeightMap: -1,
        lvlObjective: levelObjectives.killAllTank,
    }),
    new Level({
        level: [
            "-----------------------",
            "---WWWWW-------W----G--",
            "---W-----------W-------",
            "---W-B---------W-------",
            "---W-----------W-------",
            "---W-----------WWWWW---",
            "-----------------------",
            "-----------------------",
            "---WWWWWW----------W---",
            "--------W----------W---",
            "--P-----W----------W---",
            "--------W------WWWWW-R-",
            "-----------------------",
        ],
        sol: "textures/ground_diffuse.png",
        minHeightMap: -1,
        lvlObjective: levelObjectives.killAllTank,
    }),
]

let current_level_dico = level_map[0]

/**
 * @param {number} lvl_number 
 */
function draw_level_map() {

    let widthOffset = (cell_x_number - current_level.length) / 2
    let heightOffset = (cell_y_number - current_level[0].length) / 2

    document.getElementById("level").innerHTML = (level + 1) + "/" + level_map.length

    setCurrentLevelDico()
    if (level == 0) {
        if (char1) char1.dispose(true);
        char1 = new Char(ObjectEnum.Player, 0, 0, 0, 2 * speedMultUti, 800 * reloadMultUti, 40);
        selected_bonuses = []
    }

    let setPlayerPosition = () => {
        for (var [l_index, line] of current_level.entries()) {
            for (var [ch_index, ch] of line.split('').entries()) {
                if (ch == "P") {
                    var posX = (ch_index + 1) * cell_size + widthOffset;
                    var posY = (current_level.length - l_index) * cell_size + heightOffset;
                    char1.shape.position = new BABYLON.Vector3(-width / 2 + posX, Char.height / 2 + 1
                        , -height / 2 + posY)
                    // char1 = new Char(ObjectEnum.Player, posX, posY, 0, 3 * speedMultUti, 800 * reloadMultUti, 40);
                    chars.push(char1);
                    // camera.target = char1.getTurretTank();
                    char1.shape.rotate(BABYLON.Axis.Y, Math.PI / 2)
                    // camera.alpha -= Math.PI / 2
                    char1.health = char1.maxHealth
                    return
                }
            }
        }
    }
    setPlayerPosition()
    for (var [l_index, line] of current_level.entries()) {
        for (var [ch_index, ch] of line.split('').entries()) {
            var posX = (ch_index + 1) * cell_size + widthOffset;
            var posY = (current_level.length - l_index) * cell_size + heightOffset;
            switch (ch) {
                case '-':
                    break;
                case 'N':
                    var char = new Char(ObjectEnum.CharRed, posX, posY, 0, 0, 0, 0);
                    charsAI.push(char);
                    char.setStrategy(new noStrategy(char))
                    chars.push(char);

                    char.applyStrategy()
                    break;
                case 'R':
                    var char = new Char(ObjectEnum.CharRed, posX, posY, 0, 2, 2000, 40);
                    charsAI.push(char);
                    char.setStrategy(new guaranteedAI(char))
                    chars.push(char);

                    char.applyStrategy()
                    break;
                case 'B':
                    var char = new Char(ObjectEnum.CharBlue, posX, posY, 0, 2, 10000, 20);
                    charsAI.push(char);
                    chars.push(char);
                    char.setStrategy(new guaranteedAI(char))
                    char.applyStrategy()
                    break;
                case 'G':
                    var char = new Char(ObjectEnum.CharGreen, posX, posY, 0, 2, 4000, 10);
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
                case 'h':
                    barrels.push(new Barrel(posX, posY))
                    break;
                case 't':
                    trees.push(new Tree(posX, posY))
                    break;
                case 'r':
                    rocks.push(new Rock(posX, posY))
                    break;
            }
        }
    }

    tanksAIReady = true;

    // Creation de l'enceinte 
    // walls.push(new WallPerimeter(-width / 2, 0.5, 1, height + 2))
    // walls.push(new WallPerimeter(width / 2 + 1, 0.5, 1, height + 2))
    // walls.push(new WallPerimeter(0.5, height / 2 + 1, width, 1))
    // walls.push(new WallPerimeter(0.5, -height / 2, width, 1))
    delimiters.push(new DelimiterMesh(-width / 2, 0.5, 2, height + 2))
    delimiters.push(new DelimiterMesh(width / 2 + 1, 0.5, 2, height + 2))
    delimiters.push(new DelimiterMesh(0.5, height / 2 + 2, width, 2))
    delimiters.push(new DelimiterMesh(0.5, -height / 2, width, 2))
}

function setCurrentLevelDico() {
    current_level_dico = level_map[level]
    if (current_level_dico) {
        current_level = current_level_dico.level;
        cell_x_number = current_level_dico.level.length;
        cell_y_number = current_level_dico.level[0].length;

        height = cell_x_number * cell_size;
        width = cell_y_number * cell_size;
    }
}