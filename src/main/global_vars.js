var cell_x_number = 40;
var cell_y_number = 40;

var cell_size = 1;

var width = cell_x_number * cell_size;
var height = cell_y_number * cell_size;

/** @type {BABYLON.Scene} */
var scene;

/** @type {BABYLON.FreeCamera} */
var camera;

/** @type {Char} */
var char1;

/** @type {[Char]} */
var charsAI;

/** @type {[Char]} */
var chars;

/** @type {[Bonus]} */
var bonuses;

/** @type {[Bonus]} */
var selected_bonuses;

/** @type {[Wall]} */
var walls;

/** @type {[DelimiterMesh]} */
var delimiters;

/** @type {[Barrel]} */
var barrels;

/** @type {[Mine]} */
var mines;

/** @type {[Bullet]} */
var bullets = []

/** @type {[Tree]} */
var trees = []

var gravity = -9.81

level = 0;

var mousepos = { x: 0, y: 0 };

var inputStates = {};

/** @type {number} */
var playing;

/** @type {number} */
var level;
var speedMultUti = 1;
var reloadMultUti = 1;

var backgroundTexture = new Image();
backgroundTexture.src = './images/woodTexture.jpg';

var wallTexture = new Image();
wallTexture.src = './images/wallTexture.jpg';

var wallDTexture = new Image();
wallDTexture.src = './images/wallDTexture.jpg';

var barrelImage = new Image();
barrelImage.src = './images/hole.png';

var tankImage = new Image();
tankImage.src = './images/tank.png';

var tankImageRed = new Image();
tankImageRed.src = './images/tankRed.png';

var tankImageBlue = new Image();
tankImageBlue.src = './images/tankBlue.png';

var tankImageGreen = new Image();
tankImageGreen.src = './images/tankGreen.png';

var bulletImage = new Image();
bulletImage.src = './images/bullet.png';

var bonusImage = new Image();
bonusImage.src = './models/box/Material_51_baseColor.png';

var mineImage = new Image();
mineImage.src = './images/minemine.png';

var treeImage = 'no tree image'

let minePlacedSound = new Audio('audio/mineplace.wav');

let applauseSound = new Audio('audio/Human-Applause-LargeCrowd01.mp3');

let menuHoverSound = new Audio('audio/hoverMenu.wav');
menuHoverSound.volume = 0.2

let bonusTookSound = new Audio('audio/hammer.wav');
bonusTookSound.volume = 0.2

let musicBackground = new Audio('audio/warmusic.mp3')
musicBackground.volume = 0.1

var impostorCharList = [];