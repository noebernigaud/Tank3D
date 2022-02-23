function explode(emitter) {
    BABYLON.ParticleHelper.CreateAsync("explosion", scene).then((set) => {
        set.systems.forEach(s => {
            s.disposeOnStop = true;
        });

        for (var sys of set.systems) {
            sys.worldOffset = new BABYLON.Vector3(emitter.position.x, emitter.position.y, emitter.position.z);
            sys.maxScaleX = 0.1;
            sys.maxScaleY = 0.1;
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
        emitterType.radius = 0.1 / 40;
        emitterType.radiusRange = 0;
        particleSystem.particleEmitterType = emitterType;
    } else {
        let d = getTurretTank().getDirection(BABYLON.Axis.Z);
        let r = 0.5 / 40;
        let d1 = new BABYLON.Vector3(d.x + r, d.y + r, d.z + r);
        let d2 = new BABYLON.Vector3(d.x - r, d.y - r, d.z - r);
        particleSystem.createPointEmitter(d1, d2)
    }

    // Colors of all particles
    particleSystem.color1 = isExploding ? new BABYLON.Color4(1, 0, 0, 1) : new BABYLON.Color4(1, 0.5, 0, 1);
    particleSystem.color2 = new BABYLON.Color4(1, 0.5, 0, 1);
    particleSystem.colorDead = isExploding ? new BABYLON.Color4(1, 0.5, 0, 1) : new BABYLON.Color4(0.5, 0.5, 0, 0);

    // Size of each particle
    particleSystem.minSize = 0.1 / 40;
    particleSystem.maxSize = 0.5 / 40;

    // Life time of each particle
    particleSystem.minLifeTime = 0.5;
    particleSystem.maxLifeTime = isExploding ? 1.9 : 1.2;

    // Blend mode : BLENDMODE_ONEONE / BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);

    // Angular speed
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = isExploding ? 5 : isCanonFire ? 3 : 7;
    particleSystem.maxEmitPower = isExploding ? 15 : isCanonFire ? 5 : 10;
    particleSystem.updateSpeed = isExploding ? 0.09 : 0.10;

    // Size
    particleSystem.minSize = isExploding ? 5 : isCanonFire ? 2 : 1;
    particleSystem.maxSize = isExploding ? 15 : isCanonFire ? 4 : 3;

    particleSystem.manualEmitCount = isExploding ? 6000 : isCanonFire ? 1000 : 50;
    particleSystem.disposeOnStop = true;

    return particleSystem;
}

function smoke() {
    var ph = BABYLON.ParticleHelper.CreateAsync("smoke", scene).then((set) => {
        for (const sys of set.systems) {
            sys.worldOffset = new BABYLON.Vector3(tankContainer.position.x, tankContainer.position.y, tankContainer.position.z);
            sys.maxScaleX = 6 / 100;
            sys.maxScaleY = 6 / 100;
        }
        set.start();
    });
    ph.emitter = tankContainer
}

function createSmoke(emitter) {
    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", 8000);

    // Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("textures/smoke.png");

    // lifetime
    particleSystem.minLifeTime = 2;
    particleSystem.maxLifeTime = 5;

    // Emit rate
    particleSystem.emitRate = 100;

    // Gravity
    particleSystem.gravity = new BABYLON.Vector3(0.25, 9.5, 0);

    // Size gradient
    particleSystem.addSizeGradient(0, 0.6, 1);
    particleSystem.addSizeGradient(0.3, 1, 2);
    particleSystem.addSizeGradient(0.5, 2, 3);
    particleSystem.addSizeGradient(1.0, 6, 8);

    // Color gradient
    particleSystem.addColorGradient(0, new BABYLON.Color4(0.5, 0.5, 0.5, 0), new BABYLON.Color4(0.8, 0.8, 0.8, 0));
    particleSystem.addColorGradient(0.4, new BABYLON.Color4(0.1, 0.1, 0.1, 0.1), new BABYLON.Color4(0.4, 0.4, 0.4, 0.4));
    particleSystem.addColorGradient(0.7, new BABYLON.Color4(0.03, 0.03, 0.03, 0.2), new BABYLON.Color4(0.3, 0.3, 0.3, 0.4));
    particleSystem.addColorGradient(1.0, new BABYLON.Color4(0.0, 0.0, 0.0, 0), new BABYLON.Color4(0.03, 0.03, 0.03, 0));

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
    particleSystem.minSize = 15 / 1000;
    particleSystem.maxSize = 25 / 1000;

    // Blendmode
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;

    // Emitter shape
    var sphereEmitter = particleSystem.createSphereEmitter(0.1);

    // Where the particles come from
    particleSystem.emitter = emitter; // the starting object
    particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5);

    return particleSystem;
}

function playSmoke(particleSystem) {
    particleSystem.start();
}

function stopSmoke(particleSystem) {
    particleSystem.stop();
}