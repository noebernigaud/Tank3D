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

var impostorCharList = [];

const BIOMES = ["Earth", "Sand", "Snow"]
var biome = BIOMES[0];


//Texture meshes
var wallTexture = new Image();
wallTexture.src = './images/wallTexture.jpg';

var wallDTexture = new Image();
wallDTexture.src = './images/wallDTexture.jpg';

var bulletImage = new Image();
bulletImage.src = './images/bullet.png';

//Sound effects
let explosionSound = new Audio('audio/Explosion2.wav');
explosionSound.volume = 0.2;

let applauseSound = new Audio('audio/Human-Applause-LargeCrowd01.mp3');

let menuHoverSound = new Audio('audio/hoverMenu.wav');
menuHoverSound.volume = 0.2

let bonusTookSound = new Audio('audio/hammer.wav');
bonusTookSound.volume = 0.2

let musicBackground = new Audio('audio/warmusic.mp3')
musicBackground.volume = 0.1
musicBackground.loop = true

var impostorCharList = [];
