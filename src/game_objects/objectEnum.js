class ObjectEnum {
  // Create new instances of the same class as static attributes
  static Bullet = new ObjectEnum(bulletImage.src)
  static Hole = new ObjectEnum(holeImage.src)
  static WallD = new ObjectEnum(wallDTexture.src)
  static Wall = new ObjectEnum(wallTexture.src)
  static Mine = new ObjectEnum(mineImage.src)
  static Player = new ObjectEnum(tankImage.src)
  static CharRed = new ObjectEnum(tankImageRed.src)
  static CharBlue = new ObjectEnum(tankImageBlue.src)
  static CharGreen = new ObjectEnum(tankImageGreen.src)

  constructor(name) {
    this.name = name
  }
}
