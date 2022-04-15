function explode(emitter) {
    BABYLON.ParticleHelper.CreateAsync("explosion", scene).then((set) => {
        set.systems.forEach(s => {
            s.disposeOnStop = true;
        });

        for (var sys of set.systems) {
            sys.emitter = emitter
            sys.worldOffset = new BABYLON.Vector3(emitter.position.x, emitter.position.y, emitter.position.z);
        }
        set.start();

    });
}

function bulletExplode(position, isExploding, isCanonFire) {
    var isCanonFire = isCanonFire || false;

    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem("bulletParticles", 200, scene);

    // Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);

    // Where the particles come from
    particleSystem.emitter = position;

    // Shape of emission
    if (!isCanonFire) {
        var emitterType = new BABYLON.SphereParticleEmitter();
        emitterType.radius = 0.1;
        emitterType.radiusRange = 0;
        particleSystem.particleEmitterType = emitterType;
    } else {
        let d = char1.getTurretTank().getDirection(BABYLON.Axis.Z);
        let r = 0.02;
        let d1 = new BABYLON.Vector3(d.x + r, d.y + r, d.z + r);
        let d2 = new BABYLON.Vector3(d.x - r, d.y - r, d.z - r);
        particleSystem.createPointEmitter(d1, d2)
    }

    // Colors of all particles
    particleSystem.color1 = isExploding ? new BABYLON.Color4(1, 0, 0, 1) : new BABYLON.Color4(1, 0.5, 0, 1);
    particleSystem.color2 = new BABYLON.Color4(1, 0.5, 0, 1);
    particleSystem.colorDead = isExploding ? new BABYLON.Color4(1, 0.5, 0, 1) : isCanonFire ? new BABYLON.Color4(0.5, 0.5, 0.2, 0.5) : new BABYLON.Color4(0.75, 0.75, 0.75, 0.75);

    // Life time of each particle
    particleSystem.minLifeTime = isExploding ? 0.5 : isCanonFire ? 0.5 : 0.2;
    particleSystem.maxLifeTime = isExploding ? 1.9 : isCanonFire ? 1.2 : 1.3;

    // Blend mode : BLENDMODE_ONEONE / BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);

    // Angular speed
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = isExploding ? 5 / 40 : isCanonFire ? 3 : 1 / 40;
    particleSystem.maxEmitPower = isExploding ? 15 / 40 : isCanonFire ? 5 : 10 / 40;
    particleSystem.updateSpeed = isExploding ? 0.09 : isCanonFire ? 0.10 : 0.12;

    // Size
    particleSystem.minSize = isExploding ? 5 / 40 : isCanonFire ? 6 / 40 : 2 / 40;
    particleSystem.maxSize = isExploding ? 15 / 40 : isCanonFire ? 10 / 40 : 4 / 40;

    particleSystem.manualEmitCount = isExploding ? 6000 : isCanonFire ? 1000 : 50;
    particleSystem.disposeOnStop = true;

    return particleSystem;
}

function createSmoke(emitter, isRight = false, isMoving = false, permanent = false) {
    const box = BABYLON.MeshBuilder.CreateBox("smokeTank", { size: 0.05 });
    box.parent = emitter
    box.position.z -= 0.95
    box.position.y += 0.1
    box.position.x += isRight ? 0.12 : -0.08
    box.isVisible = false

    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", isMoving ? 2000 : 3000);

    // Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("textures/smoke.png");

    // lifetime
    particleSystem.minLifeTime = isMoving ? 0.1 : 2;
    particleSystem.maxLifeTime = isMoving ? 0.2 : 3;

    // Emit rate
    particleSystem.emitRate = isMoving ? 200 : 300;

    // Gravity
    particleSystem.gravity = new BABYLON.Vector3(0.25, isMoving ? 6 : 4, 0);

    // Size gradient
    if (isMoving) {
        particleSystem.addSizeGradient(0, 0.1 / 20, 0.2 / 20);
        particleSystem.addSizeGradient(0.05 / 20, 0.15 / 20, 0.3 / 20);
        particleSystem.addSizeGradient(0.1 / 20, 0.3 / 20, 0.5 / 20);
        particleSystem.addSizeGradient(0.15 / 20, 1 / 20, 1.2 / 20);
    } else {
        particleSystem.addSizeGradient(0, 0.6 / 20, 1 / 20);
        particleSystem.addSizeGradient(0.3 / 20, 1 / 20, 2 / 20);
        particleSystem.addSizeGradient(0.5 / 20, 2 / 20, 3 / 20);
        particleSystem.addSizeGradient(1.0 / 20, 6 / 20, 8 / 20);
    }

    // Color gradient

    if (isMoving) {
        particleSystem.addColorGradient(0, new BABYLON.Color4(0.1, 0.1, 0.1, 0), new BABYLON.Color4(0.2, 0.2, 0.2, 0.5));
        particleSystem.addColorGradient(0.4, new BABYLON.Color4(0.2, 0.2, 0.2, 0.2), new BABYLON.Color4(0.3, 0.3, 0.3, 0.1));
        particleSystem.updateSpeed = 0.005;
    }
    else {
        particleSystem.addColorGradient(0, new BABYLON.Color4(0.5, 0.5, 0.5, 0), new BABYLON.Color4(0.8, 0.8, 0.8, 0));
        particleSystem.addColorGradient(0.4, new BABYLON.Color4(0.1, 0.1, 0.1, 0.1), new BABYLON.Color4(0.4, 0.4, 0.4, 0.4));
        particleSystem.addColorGradient(0.7, new BABYLON.Color4(0.03, 0.03, 0.03, 0.2), new BABYLON.Color4(0.3, 0.3, 0.3, 0.4));
        particleSystem.addColorGradient(1.0, new BABYLON.Color4(0.0, 0.0, 0.0, 0), new BABYLON.Color4(0.03, 0.03, 0.03, 0));
        particleSystem.updateSpeed = 0.01;
    }

    // Speed gradient
    particleSystem.addVelocityGradient(0, 1, 1.5);
    particleSystem.addVelocityGradient(0.1, 0.8, 0.9);
    particleSystem.addVelocityGradient(0.7, 0.4, 0.5);
    particleSystem.addVelocityGradient(1, 0.1, 0.2);


    // Rotation
    particleSystem.minInitialRotation = 0;
    particleSystem.maxInitialRotation = Math.PI;
    particleSystem.minAngularSpeed = -1;
    particleSystem.maxAngularSpeed = 1;

    // Size
    // particleSystem.minSize = isMoving ? 0.1 : 0.375;
    // particleSystem.maxSize = isMoving ? 0.2 : 0.625;


    particleSystem.addSizeGradient(0, isMoving ? 0.03 : 0.0375);
    particleSystem.addSizeGradient(1, isMoving ? 0.2 : 0.825);


    // Blendmode
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;

    // Emitter shape
    //var sphereEmitter = particleSystem.createSphereEmitter(0.1);

    // Where the particles come from
    particleSystem.emitter = isMoving ? box : emitter; // the starting object
    particleSystem.minEmitBox = new BABYLON.Vector3(-0.5, -0.5, -0.5).scale(isMoving ? 0.08 : 1);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5).scale(isMoving ? 0.08 : 1);


    if (!isMoving && !permanent) particleSystem.targetStopDuration = 12;
    particleSystem.disposeOnStop = true;

    particleSystem.start();

    return particleSystem;
}

function createDust(emitter) {
    var particleSystem = new BABYLON.ParticleSystem("particles", 1000);

    // Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("textures/smoke.png");

    // lifetime
    particleSystem.minLifeTime = 2;
    particleSystem.maxLifeTime = 4;

    // Emit rate
    particleSystem.emitRate = 100;

    // Gravity
    particleSystem.gravity = new BABYLON.Vector3(0, -2, 0);

    // Size gradient
    particleSystem.addSizeGradient(0, 0.6 / 20, 1 / 20);
    particleSystem.addSizeGradient(0.3 / 20, 1 / 20, 2 / 20);
    particleSystem.addSizeGradient(0.5 / 20, 2 / 20, 3 / 20);
    particleSystem.addSizeGradient(1.0 / 20, 6 / 20, 8 / 20);


    // Color gradient
    particleSystem.setColor = () => {
        if (biome == "Snow") particleSystem.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 0.2), new BABYLON.Color4(1, 1, 1, 0.2))
        else particleSystem.addColorGradient(0, new BABYLON.Color4(194 / 255, 178 / 255, 128 / 255, 0.2), new BABYLON.Color4(225 / 255, 191 / 255, 146 / 255, 0.1))
    }

    particleSystem.setColor()

    particleSystem.updateColor = () => {
        particleSystem.removeSizeGradient(0);
        particleSystem.setColor()
    }
    // Rotation
    particleSystem.minInitialRotation = 0;
    particleSystem.maxInitialRotation = Math.PI;
    particleSystem.minAngularSpeed = -1;
    particleSystem.maxAngularSpeed = 1;

    // Size
    particleSystem.minSize = 0.5;
    particleSystem.maxSize = 0.7;

    // Blendmode
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;


    // Where the particles come from
    particleSystem.emitter = emitter; // the starting object
    particleSystem.minEmitBox = new BABYLON.Vector3(-0.5, -0.45, -0.5)
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.5, -0.35, 0.5)


    return particleSystem;
}

function playSmoke(particleSystem) {
    particleSystem.start();
}

function stopSmoke(particleSystem) {
    particleSystem.stop();
}

// function createFire(emitter) {
//     BABYLON.ParticleHelper.CreateAsync("fire", scene).then((set) => {
//         set.systems.forEach(s => {
//             s.disposeOnStop = true;

//         });
//         for (var sys of set.systems) {
//             if (sys.name != "sparksEdge") {
//                 sys.minSize = 0.5
//                 sys.maxSize = 2

//             } else {
//                 sys.minSize = 0.1
//                 sys.maxSize = 0.5
//             }
//             sys.targetStopDuration = 20;
//             sys.minEmitBox = new BABYLON.Vector3(-0.1, -0.1, -0.1);
//             sys.maxEmitBox = new BABYLON.Vector3(0.1, 0.1, 0.1);
//             sys.emitter = emitter

//         }

//         set.start();

//     });
// }

function createBonusEffect(emitter) {
    const particleSystem = new BABYLON.ParticleSystem("particles", 100);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png");

    //Gravity
    particleSystem.gravity = new BABYLON.Vector3(0, -4, 0);

    // Size
    particleSystem.minSize = 0.05;
    particleSystem.maxSize = 0.2;

    // Position where the particles are emiited from
    particleSystem.emitter = emitter;
    particleSystem.minEmitBox = new BABYLON.Vector3(-0.40, -0.4, -0.4)
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.40, -0.5, 0.4)

    // Emit rate
    particleSystem.emitRate = 50;

    particleSystem.minEmitPower = 3

    // Rotation
    particleSystem.minInitialRotation = 0;
    particleSystem.maxInitialRotation = Math.PI;
    particleSystem.minAngularSpeed = -1;
    particleSystem.maxAngularSpeed = 1;

    particleSystem.color2 = new BABYLON.Color3(0.81, 0.71, 0.23);
    particleSystem.color1 = new BABYLON.Color3(1, 0.87, 0);



    particleSystem.updateSpeed = 0.005;
    particleSystem.start();

    return particleSystem
}

function createFire(emitter) {
    //Smoke
    var smokeSystem = new BABYLON.ParticleSystem("particles", 1000, scene);
    smokeSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);
    smokeSystem.minEmitBox = new BABYLON.Vector3(-0.5, 1, -0.5); // Starting all from
    smokeSystem.maxEmitBox = new BABYLON.Vector3(0.5, 1, 0.5); // To...

    smokeSystem.color1 = new BABYLON.Color4(0.02, 0.02, 0.02, .02);
    smokeSystem.color2 = new BABYLON.Color4(0.02, 0.02, 0.02, .02);
    smokeSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

    smokeSystem.minSize = 1;
    smokeSystem.maxSize = 3;

    smokeSystem.minLifeTime = 0.3;
    smokeSystem.maxLifeTime = 1.5;

    smokeSystem.emitRate = 350;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    smokeSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    smokeSystem.gravity = new BABYLON.Vector3(0, 0, 0);

    smokeSystem.direction1 = new BABYLON.Vector3(-1.5, 8, -1.5);
    smokeSystem.direction2 = new BABYLON.Vector3(1.5, 8, 1.5);

    smokeSystem.minAngularSpeed = 0;
    smokeSystem.maxAngularSpeed = Math.PI;

    smokeSystem.minEmitPower = 0.5;
    smokeSystem.maxEmitPower = 1.5;
    smokeSystem.updateSpeed = 0.005;
    smokeSystem.emitter = emitter

    smokeSystem.start();



    // Create a particle system
    var fireSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

    //Texture of each particle
    fireSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);

    // Where the particles come from
    fireSystem.minEmitBox = new BABYLON.Vector3(-0.25, 0, -0.25); // Starting all from
    fireSystem.maxEmitBox = new BABYLON.Vector3(0.25, 0, 0.25); // To...

    // Colors of all particles
    fireSystem.color1 = new BABYLON.Color4(1, 0.5, 0, 1.0);
    fireSystem.color2 = new BABYLON.Color4(1, 0.5, 0, 1.0);
    fireSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

    // Size of each particle (random between...
    fireSystem.minSize = 0.1;
    fireSystem.maxSize = 0.5;

    // Life time of each particle (random between...
    fireSystem.minLifeTime = 0.2;
    fireSystem.maxLifeTime = 0.4;

    // Emission rate
    fireSystem.emitRate = 600;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    fireSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    fireSystem.gravity = new BABYLON.Vector3(0, 20, 0);

    // Direction of each particle after it has been emitted
    // fireSystem.direction1 = new BABYLON.Vector3(0, 4, 0);
    // fireSystem.direction2 = new BABYLON.Vector3(0, 4, 0);

    // Angular speed, in radians
    fireSystem.minAngularSpeed = 0;
    fireSystem.maxAngularSpeed = Math.PI;

    // Speed
    fireSystem.minEmitPower = 0.5;
    fireSystem.maxEmitPower = 2;
    fireSystem.updateSpeed = 0.005;

    fireSystem.emitter = emitter

    // Start the particle system
    fireSystem.start();
}