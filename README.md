# Tank3D
3D Tank Game Project for the Game on Web 2022 contest

# Goal 
Creation of a 3D Tank Game with [Babylon.js](https://www.babylonjs.com/) in Spring of 2022.

# Authors

This project has been realized by
- Bernigaud Noé
- Fissore Davide
- Venturelli Antoine

We are three students at the University of Côte d'Azur in M2 of Coumputer Science

# Code History and Development

The code has been based on Noé Bernigaud's project of a Tank game in 2D written in Javascript (the original game can be found at this [link](https://github.com/noebernigaud/TankGame)). With Babylonjs, we saw an opportunity to push the game much further and expand the game's feature to make a more complete game out of it.

At first, we started by building the engine of the engine, which would later rule all the game's interactions and mechanics.This was the most difficult part of the development, as problems that would seem quite simple could take a lot of time to solve. Moreover, we were beginners in Babylonjs, and bending the physic engine to our needs wasn't always the easy.

Some noteworthy difficulties were the implementation of the tank's movements, in particular setting up the friction, to create natural movement. Antoher difficult part was the physic of the bullets. We wanted them to go slow so the players could avoid them, making the game a lot more fun, but we also wanted to use the physic engine to make the bullets bounce.

The engine's devlopment is also the period where we learned to use models, created the bricks of the interaction between the player and the game, and made our first animations. the game was rather basic at this point ad there was no gameplay, but it had all the fundations to build up the rest of our game.

Here is a version of the game by the end of the engine's development LINK. There was still a couple of issues in the engine that we would eventually correct later, but we were quite happy about this first step and ready to start implementing the game's feature.

What marked the transition between the engine's development and the features development was the introduction of the heightmap. This was a game-changer both for graphics and gameplay. After that, we developped menus, different levels, added new models, and changed our empty world into a beautiful island. We also introduced the sounds and music, and builded a function to make sound's volumes dynamic depending on the distance of the emitter relative to the player.

The opponent's AI was then deployed, as well as multiple level objectives. One of the main challenge for the AI was to keep it simple but also make it look natural and interesting, and we are very happy about the current result. Another big part was to make the AI stay in the island and not go into the water, and to make it target the player.

The next part was to improve the controls - up until now, the aim was donne with the keyboard's arrow keys. You can still do it now, but we wanted to also give to the player the possibility to aim with their mouse, as it would feel much more natural, dynamic, and precise. Requesting pointerlock to capture the mouse into the game was tricky as navigators have strict standards regarding this, and we also wanted to give back the mouse to the player in menus, but we were eventually successful in its implementation.

At this point, the game was starting to look like a complete game. We had gameplay with different levels and ennemies, a good-looking map, a rudimentary menu, and the tank felt pleasant to control. However, it was still lacking some fun gameplay and discovery factor. It was time to implement the bonus feature, which would make our game into a roguelike, very fitting of the theme "You are unique".

Special bonuses were a particularly fun stage of the development, as they made the game a lot more enjoyable. While they took a lot of time to implement, the whole engine we already built was making the whole process a lot easier, giving more space to our imagination and to testing.

With 8 Special Bonuses and X normal ones, there are exactly XXX possibilites of building your tank. This makes the game a lot more interesting to re-play, and give sense to the theme "you are unique", as the tank you are playing by the end of the game is likely unique across all games and all players.

# Audio source 

[Crush8-Bit.ogg](https://rpg.hamsterrepublic.com/wiki-images/d/db/Crush8-Bit.ogg), 
[Explosion2.wav](http://schaeffer.ludo.free.fr/worms/DATA/Wav/Effects/Explosion2.wav), 
[plop.mp3](https://mainline.i3s.unice.fr/mooc/SkywardBound/assets/sounds/plop.mp3), 
[Collision8-Bit.ogg](http://commondatastorage.googleapis.com/codeskulptor-assets/Collision8-Bit.ogg), 
[minplace.wav](http://www.utc.fr/si28/ProjetsUpload/P2006_si28p004/flash_puzzle/sons/rush/mineplace.wav), 
[Human-Applause-LargeCrowd01.mp3](http://sfxcontent.s3.amazonaws.com/soundfx/Human-Applause-LargeCrowd01.mp3)
