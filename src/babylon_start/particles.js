function explode(emitter) {
    BABYLON.ParticleHelper.CreateAsync("explosion", scene).then((set) => {
        set.systems.forEach(s => {
            s.disposeOnStop = true;
        });

        for (var sys of set.systems) {
            sys.emitter = emitter
            sys.worldOffset = new BABYLON.Vector3(emitter.position.x, emitter.position.y, emitter.position.z);
            // sys.minScaleX = 0.1;
            // sys.minScaleY = 0.1;
            // sys.maxScaleX = 0.2;
            // sys.maxScaleY = 0.2;
            // sys.minEmitPower = 0.1;
            // sys.maxEmitPower = 0.1;
            // sys.minSize = 1;
            // sys.maxSize = 1.5;
            // sys.minSize = sys.minSize / 100;
            // sys.maxSize = sys.maxSize / 100;
            // sys.minEmitPower = sys.minEmitPower / 100;
            // sys.maxEmitPower = sys.maxEmitPower / 100;
            // sys.emitRate = sys.emitRate / 100;
            // sys.minScaleX = sys.minScaleX / 100;
            // sys.minScaleY = sys.minScaleY / 100;
            // sys.minScaleZ = sys.minScaleZ / 100;
            // sys.maxScaleX = sys.maxScaleX / 100;
            // sys.maxScaleY = sys.maxScaleY / 100;
            // sys.maxScaleZ = sys.maxScaleZ / 100;
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

function createSmoke(emitter) {
    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", 8000);

    // Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("textures/smoke.png");

    // lifetime
    particleSystem.minLifeTime = 2;
    particleSystem.maxLifeTime = 5;

    // Emit rate
    particleSystem.emitRate = 200;

    // Gravity
    particleSystem.gravity = new BABYLON.Vector3(0.25, 4, 0);

    // Size gradient
    particleSystem.addSizeGradient(0, 0.6 / 20, 1 / 20);
    particleSystem.addSizeGradient(0.3 / 20, 1 / 20, 2 / 20);
    particleSystem.addSizeGradient(0.5 / 20, 2 / 20, 3 / 20);
    particleSystem.addSizeGradient(1.0 / 20, 6 / 20, 8 / 20);

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
    particleSystem.minSize = 15 / 40;
    particleSystem.maxSize = 25 / 40;

    // Blendmode
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;

    // Emitter shape
    //var sphereEmitter = particleSystem.createSphereEmitter(0.1);

    // Where the particles come from
    particleSystem.emitter = emitter; // the starting object
    particleSystem.minEmitBox = new BABYLON.Vector3(-0.3, -0.3, -0.3);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.3, 0.3, 0.3);


    particleSystem.targetStopDuration = 3;
    particleSystem.disposeOnStop = true;

    particleSystem.start();

    return particleSystem;
}

function playSmoke(particleSystem) {
    particleSystem.start();
}

function stopSmoke(particleSystem) {
    particleSystem.stop();
}

function createFire(emitter) {
    BABYLON.ParticleHelper.CreateAsync("fire", scene).then((set) => {
        set.systems.forEach(s => {
            s.disposeOnStop = true;

        });
        for (var sys of set.systems) {
            if (sys.name != "sparksEdge") {
                sys.minSize = 0.5
                sys.maxSize = 2

            } else {
                sys.minSize = 0.1
                sys.maxSize = 0.5
            }
            sys.targetStopDuration = 20;
            sys.minEmitBox = new BABYLON.Vector3(-0.1, -0.1, -0.1);
            sys.maxEmitBox = new BABYLON.Vector3(0.1, 0.1, 0.1);
            sys.emitter = emitter

        }

        set.start();

    });
}