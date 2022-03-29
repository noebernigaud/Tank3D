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

/** @type {[Wall]} */
var walls;

/** @type {[Hole]} */
var holes;

/** @type {[Mine]} */
var mines;

/** @type {[Bullet]} */
var bullets = []

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

var holeImage = new Image();
holeImage.src = './images/hole.png';

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

var mineImage = new Image();
mineImage.src = './images/minemine.png';

let explosionSound = new Audio('audio/Explosion2.wav');
explosionSound.volume = 0.2;

let bulletFiredSound = new Audio('audio/Explosion2.wav');
bulletFiredSound.volume = 0.2;

let bulletBounceSound = new Audio('audio/plop.mp3');

let bulletDestroyedSound = new Audio('audio/Collision8-Bit.ogg');

let minePlacedSound = new Audio('audio/mineplace.wav');

let applauseSound = new Audio('audio/Human-Applause-LargeCrowd01.mp3');

var impostorCharList = [];