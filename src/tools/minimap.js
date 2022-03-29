class MiniMap {

  /** @type {CanvasRenderingContext2D} */
  ctx;

  /** @type {HTMLCanvasElement} */
  canvas;

  constructor() {
    this.canvas = document.getElementById('minimap');
    this.ctx = this.canvas.getContext('2d');
  }

  drawPoint(x, y, color, isBullet = false) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, isBullet ? 0.5 : 2, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.stroke();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  resize() {
    let width = window.innerWidth / 6;
    let height = window.innerHeight / 6;
    this.canvas.width = Math.min(width, height)
    this.canvas.height = Math.min(width, height)
  }

  redraw() {
    setCurrentLevelDico()
    this.clear()
    let resize = (x, y) => ({
      x: (1 - (x + height / 2) / height) * this.canvas.width * 0.6 + this.canvas.width * 0.4 / 2,
      y: (1 - (y + width / 2) / width) * this.canvas.height * 0.6 + this.canvas.height * 0.4 / 2
    })
    chars.forEach(c => {
      let point = resize(c.shape.position.z, c.shape.position.x);
      // console.log(point);
      this.drawPoint(point.x, point.y, c == char1 ? 'rgb(0,255,0)' : 'rgb(255, 0, 0)')
    })
    walls.forEach(w => {
      if (w instanceof WallPerimeter) return
      let point = resize(w.shape.position.z, w.shape.position.x);
      this.drawPoint(point.x, point.y, 'rgb(165,42,42)')
    })
    holes.forEach(w => {
      let point = resize(w.shape.position.z, w.shape.position.x);
      this.drawPoint(point.x, point.y, 'rgb(165,42,42)')
    })
    bullets.forEach(b => {
      let point = resize(b.position.z, b.position.x);
      this.drawPoint(point.x, point.y, 'rgb(0,0,0)', true)
    })
  }

  hide() {
    this.canvas.style.display = "none"
  }

  show() {
    this.canvas.style.removeProperty("display")
  }
}
