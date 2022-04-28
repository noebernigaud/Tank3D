const BIOMES = ["Earth", "Sand", "Snow"]
var biome;
const level_map = [
    new Level({
        level:
            [
                "-----------------------------",
                "-----------------------------",
                "------P---C------------------",
                "-----------------------------",
                "-----------------------------",
                "-----------------------------",
                "------------t----------------",
                "------t---------------r--c---",
                "-----------------------------",
                "-----------------------------",
                "---------WWWWWWWWWWWW--------",
                "--r--------------------------",
                "-----------------------------",
                "-----------------------------",
                "-----------t-----------------",
                "------R--------------R-------",
                "-----------------------------",
                "-----------------------------",
                "-----------------------------",
            ],
        minHeightMap: -0.1,
        lvlObjective: levelObjectives.getBonusesAndKillTanks,
        biome: "Earth"
    }),
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
                "-------------t--------N------",
                "-----------W--W--------------",
                "--------P-----w--------------",
                "--------------w--------------",
                "----r------W--W----------R---",
                "-----------------t-----------",
                "---------C-------------------",
                "-----------------------------",
                "----------t-----------r------",
                "-----t-----------------------",
                "-----------------t-----------",
                "-t-------r----------------t--",
            ],
        minHeightMap: -0.1,
        lvlObjective: levelObjectives.getBonusesAndKillTanks,
        biome: "Earth"
    }),
    new Level({
        level:
            [
                "-----------------------------",
                "-----------------------------",
                "-----t----------------t------",
                "---------------t-------------",
                "---------h-----------t-------",
                "----t------------t-----------",
                "---------t----------t--------",
                "-----------------------------",
                "--------P-----w------R-------",
                "-----------------------------",
                "-----t--------c---t----------",
                "---------------t-------------",
                "---------------------t-------",
                "-------------t---------------",
                "-----t----------------t------",
                "-----------------------------",
                "-----------------------------",
            ],
        minHeightMap: -0.1,
        lvlObjective: levelObjectives.killAllTank,
        biome: "Sand"
    }),
    new Level({
        level:
            [
                "-----------------------------",
                "-----------------------------",
                "-----------------------------",
                "-------t---t---t---t---------",
                "-----------------------------",
                "-----------------------R-----",
                "-------t---t---t---t---------",
                "-----------------------------",
                "--------------R--------------",
                "-----------------------------",
                "-----------------------------",
                "-------WWWWWWWWWWWWW---------",
                "-----------------------------",
                "----------C------------------",
                "----P------------------------",
                "-----------------------------",
                "-----------------------------",
            ],
        minHeightMap: -1,
        lvlObjective: levelObjectives.burnAllTrees,
        biome: "Sand"
    }),
    new Level({
        level:
            [
                "-----------------------------",
                "-------------t------r--------",
                "------P----------------------",
                "-----------------------------",
                "-c-WWWWWWWWWWW---------------",
                "-----------------------------",
                "---------------t-------------",
                "-----------t--c---t----------",
                "----r-------t--t-------------",
                "--------------t--r------t----",
                "----t------------------------",
                "-----------------------------",
                "----------t-----------r------",
                "-----------------------------",
                "-----------------------------",
                "------R--------R---------R---",
                "-----------------------------",
                "-----------------------------",
                "-----------------------------",
            ],
        minHeightMap: -1,
        lvlObjective: levelObjectives.killAllTank,
        biome: "Snow"
    }),
    new Level({
        level:
            [
                "-----------------------------",
                "-------------t------r--------",
                "------P-----c----------------",
                "-----------------------------",
                "---WWWWWWWWWWW---------------",
                "-----------------------------",
                "---------------t-------------",
                "-----------t------t-----N----",
                "----r-------t--t-------------",
                "---------N----t--r------t----",
                "----t------------------------",
                "-----------------------------",
                "----------t-----------r------",
                "-----------------------------",
                "-----------------------------",
                "------R------------------R---",
                "-----------------------------",
                "---------------N-------------",
                "-----------------------------",
            ],
        minHeightMap: -1,
        lvlObjective: levelObjectives.killAllTank,
        biome: "Snow"
    }),
]
/** @type{Level} */
let current_level_dico = level_map[0]

/**
 * @param {number} lvl_number 
 */
function draw_level_map() {

    if (level == 0) {
        if (char1) char1.dispose(true);
        char1 = new Char("player", 0, 0, 0, 2 * speedMultUti, 800 * reloadMultUti, 40);
        selected_bonuses = []
    }

    setCurrentBiome()

    let widthOffset = (cell_x_number - current_level.length) / 2
    let heightOffset = (cell_y_number - current_level[0].length) / 2

    document.getElementById("level").innerHTML = (level + 1) + "/" + level_map.length


    camera.position =
        char1.position
            .multiply(char1.getTurretTank()
                .getDirection(BABYLON.Axis.Z)
                .multiply(new BABYLON.Vector3(50, 50, 50)))
            .add(new BABYLON.Vector3(0, 10, 0))


    char1.dust.updateColor()

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
                    var char = new Char("mini", posX, posY, 0, 1, 1000, 60, 2, 1, 5, 3);
                    charsAI.push(char);
                    char.setStrategy(new guaranteedAI(char))
                    chars.push(char);

                    char.applyStrategy()
                    break;
                case 'R':
                    var char = new Char("normal", posX, posY, 0, 1, 2000, 20);
                    charsAI.push(char);
                    char.setStrategy(new guaranteedAI(char))
                    chars.push(char);

                    char.applyStrategy()
                    break;
                    // case 'B':
                    //     var char = new Char(ObjectEnum.SnowTank, posX, posY, 0, 2, 10000, 30);
                    //     charsAI.push(char);
                    //     chars.push(char);
                    //     char.setStrategy(new guaranteedAI(char))
                    //     char.applyStrategy()
                    //     break;
                    // case 'G':
                    //     var char = new Char(ObjectEnum.EarthTank, posX, posY, 0, 2, 4000, 30);
                    //     charsAI.push(char);
                    //     chars.push(char);
                    //     char.setStrategy(new guaranteedAI(char))
                    //     char.applyStrategy()
                    break;
                case 'W':
                    walls.push(new Wall(posX, posY, false));
                    break;
                case 'w':
                    walls.push(new Wall(posX, posY, true));
                    break;
                case 'c':
                    bonuses.push(new Bonus(posX, posY, false));
                    break;
                case 'C':
                    bonuses.push(new Bonus(posX, posY, true));
                    break;
                case 'h':
                    barrels.push(new Barrel(posX, posY))
                    break;
                case 't':
                    trees.push(new Tree(posX, posY, current_level_dico.lvlObjective == levelObjectives.burnAllTrees ? false : undefined))
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
    console.log("SET CURRENT ");
    if (level == 0) {
        level_map.forEach(e => e.resetValues())
    }
    if (current_level_dico) {
        current_level = current_level_dico.level;
        cell_x_number = current_level_dico.level.length;
        cell_y_number = current_level_dico.level[0].length;

        height = cell_x_number * cell_size;
        width = cell_y_number * cell_size;

        // current_level_dico.resetValues()
    }
    if (level == 0 || current_level_dico.biome != level_map[level - 1].biome) {
        ObjectEnum.initiate_all_models(ObjectEnum.load1[current_level_dico.biome])
    } else {
        draw_level_map()
    }
}

function setCurrentBiome() {
    biome = current_level_dico.biome;
    document.getElementById("minimap").style.backgroundImage = `url('textures/${biome.toLowerCase()}y_minimap.png')`;
    listGrounds.forEach(g => {
        g.position.y = -10
        g.receiveShadows = false
        g.isVisible = false
        g.checkCollision = false
        if (g.physicsImpostor) g.physicsImpostor.dispose()
    })
    let currentGround = listGrounds[BIOMES.indexOf(biome)]
    currentGround.position.y = 0
    currentGround.receiveShadows = true
    currentGround.isVisible = true
    currentGround.checkCollision = true
    currentGround.physicsImpostor = new BABYLON.PhysicsImpostor(
        currentGround,
        BABYLON.PhysicsImpostor.HeightmapImpostor,
        { mass: 0 },
        scene
    )

    listSkyboxes.forEach(s => {
        s.isVisible = false
    })
    listSkyboxes[biome == "Sand" ? 1 : 0].isVisible = true
}