const level_map = [

  [
    "-----------------------",
    "-----------------------",
    "------h------h---------",
    "-----------------------",
    "-----------------------",
    "-----------------------",
    "-----P------------R----",
    "-----------------------",
    "-----------------------",
    "-----------------------",
    "-----------------------",
    "-----------------------",
    "-----------------------",
  ],
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
    "-----------------------",
    "-----------------------",
    "-----------------------",
    "-----------------------",
  ],
  [
    "-----------------------",
    "-----------------------",
    "--------------------B--",
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
  [
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
  [
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
  [
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
]

/**
 * @param {number} lvl_number 
 */
function draw_level_map(lvl_number) {
  current_level = level_map[lvl_number];

  for (var [l_index, line] of current_level.entries()) {
    for (var [ch_index, ch] of line.split('').entries()) {
      var posX = (ch_index + 1) * cell_size;
      var posY = (current_level.length - l_index) * cell_size;
      switch (ch) {
        case '-': break;
        case 'R':
          var char = new Char(ObjectEnum.CharRed, posX, posY, 0, 0, 0, tankImageGreen);
          charsAI.push(char);
          chars.push(char);
          break;
        case 'B':
          var char = new Char(ObjectEnum.CharBlue, posX, posY, 0, 5, 10000, tankImageBlue);
          charsAI.push(char);
          chars.push(char);
          break;
        case 'G':
          var char = new Char(ObjectEnum.CharGreen, posX, posY, 0, 5, 4000, tankImageGreen);
          charsAI.push(char);
          chars.push(char);
          break;
        case 'W':
          walls.push(new Wall(posX, posY, false));
          break;
        case 'w':
          walls.push(new Wall(posX, posY, true));
          break;
        case 'P':
          char1 = new Char(ObjectEnum.Player, posX, posY, 0, 1.4 * speedMultUti, 800 * reloadMultUti, tankImage);
          chars.push(char1);
          // camera.rotation.x = 0.4854747337923555;
          // camera.rotation.y = 0.6936207932663223
          // camera.rotation.z = 0;
          // char1.updateAngle(0)
          // char1.center_camera();
          camera.target = char1.getTurretTank();
          char1.shape.rotate(BABYLON.Axis.Y, Math.PI / 2)
          camera.alpha -= Math.PI / 2
          break;
        case 'h':
          holes.push(new Hole(posX, posY))
          break;
      }
    }
    // Creation de l'enceinte 
    walls.push(new WallPerimeter(-width / 2, 0, 1, height + 1))
    walls.push(new WallPerimeter(width / 2, 0, 1, height + 1))
    walls.push(new WallPerimeter(0, height / 2, width - 1, 1))
    walls.push(new WallPerimeter(0, -height / 2, width - 1, 1))
  }
}

