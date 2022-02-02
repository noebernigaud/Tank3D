class ObjectEnum {
  // Create new instances of the same class as static attributes
  static Char = new ObjectEnum(tankImage.src)
  static Bullet = new ObjectEnum(bulletImage.src)
  static Hole = new ObjectEnum(holeImage.src)
  static WallD = new ObjectEnum(wallDTexture.src)
  static Wall = new ObjectEnum(wallTexture.src)
  static Mine = new ObjectEnum(mineImage.src)

  constructor(name) {
    this.name = name
  }
}
