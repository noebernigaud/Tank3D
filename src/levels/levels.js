const level_map = {
  "0": [
    "hhWWWWWWWWWWWWWWWWWWW-T",
    "-----------------------",
    "W----------------------",
    "W--hIh-----------------",
    "W--h-------------------",
    "W--h-------------------",
    "-W-h-------------------",
    "W--h-------------------",
    "-W-h-------------------",
    "-W-h-------------------",
    "-W-h-------------------",
    "-W-h-------------------",
    "-W-h-------------------",
    "-W-h-------------------",
  ],
  "1": [
    "----T-",
    "-h--T-",
    "--WW--",
    "------",
    "-WIw--"
  ]
}

/**
 * @param {number} lvl_number 
 */
function draw_level_map(lvl_number) {
  current_level = level_map[lvl_number];

  for (var [l_index, line] of current_level.entries()) {
    for (var [ch_index, ch] of line.split('').entries()) {
      var posX = (ch_index + 1) * cell_size;
      var posY = (l_index + 1) * cell_size;
      switch (ch) {
        case '-': break;
        case 'T':
          var char = new Char(posX, posY, 0, 1.2, 1500, tankImageBlue);
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
          char1 = new Char(posX, posY, 0, 1.4 * speedMultUti, 800 * reloadMultUti, tankImage);
          chars.push(char1);
          break;
        case 'h':
          holes.push(new Hole(posX, posY))
      }
    }
  }
}

