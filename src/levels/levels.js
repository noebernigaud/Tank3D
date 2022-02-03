const level_map = [
  [
    "-----------------------",
    "-----------------------",
    "------h----------------",
    "-----------------------",
    "-----------------------",
    "--------W--W-----------",
    "-----I-----w------T----",
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
    "--I--------------------",
    "-----------------------",
  ],
  [
    "-----------------------",
    "-------B---------------",
    "---WWwwwwwwW-----------",
    "-----------W-----------",
    "-----------W-----------",
    "-----------W-----------",
    "-----------WW-----T----",
    "------------W----------",
    "------------W----------",
    "------------W----------",
    "--I---------WwwwwwwWW--",
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
    "--I------------h---hhhh",
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
    "--I-----W----------W---",
    "--------W------WWWWW-T-",
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
        case 'T':
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
        case 'I':
          char1 = new Char(ObjectEnum.Player, posX, posY, 0, 1.4 * speedMultUti, 800 * reloadMultUti, tankImage);
          chars.push(char1);
          camera.rotation.x = 0.4854747337923555;
          camera.rotation.y = 0.6936207932663223
          camera.rotation.z = 0;
          char1.updateAngle(0)
          char1.center_camera();
          break;
        case 'h':
          holes.push(new Hole(posX, posY))
          break;
      }
    }
  }
}

