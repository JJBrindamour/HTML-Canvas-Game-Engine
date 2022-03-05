/* 
///////////////////////////////////////////////////////////////////

SETUP

///////////////////////////////////////////////////////////////////
*/

export const canvas = document.querySelector('canvas')
export const c = canvas.getContext('2d')

canvas.width = canvas.parentElement.offsetWidth
canvas.height = canvas.parentElement.offsetHeight

export const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

export function resize(
  resizeCode = () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
  }
) {
  addEventListener('resize', resizeCode)
}

/* 
///////////////////////////////////////////////////////////////////

OBJECT CLASSES

///////////////////////////////////////////////////////////////////
*/

export let objects = []

class Object {
  constructor(x = innerWidth / 2, y = innerHeight / 2, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this._strokeWeight = 0
    this._strokeColor = 'black'
    this._fillColor = '#313131'

    objects.push(this)
  }

  fill(fill) {
    this._fillColor = fill
  }

  strokeColor(strokeColor) {
    this._strokeColor = strokeColor
  }

  strokeWeight(strokeWeight) {
    this._strokeWeight = strokeWeight
  }

  draw() {
    console.log('draw')
  }

  update() {}
}

///////////////////////////////////////////////

export class Rect extends Object {
  constructor(x, y, width = 50, height = 50) {
    super(x, y, width, height)
  }

  draw() {
    c.beginPath()
    c.fillStyle = String(this._fillColor)
    c.strokeStyle = String(this._strokeColor)
    c.lineWidth = String(this._strokeWeight)
    if (this._fillColor != 'none') c.fillRect(this.x, this.y, this.width, this.height)
    if (this._strokeWeight > 0) c.strokeRect(this.x, this.y, this.width, this.height)
    c.closePath()
  }

  update() {}
}

///////////////////////////////////////////////

export class Line extends Object {
  constructor(fromX, fromY, toX, toY, weight = 1, capStyle = 'butt') {
    super()
    this.fromX = fromX
    this.fromY = fromY
    this.toX = toX
    this.toY = toY
    this._weight = weight
    this._capStyle = capStyle
  }

  weight(weight) {
    this._weight = weight
  }

  capStyle(capStyle) {
    this._capStyle = capStyle
  }

  draw() {
    c.beginPath()
    c.strokeStyle = String(this._strokeColor)
    c.lineWidth = String(this._weight)
    c.lineCap = this._capStyle
    c.moveTo(this.fromX, this.fromY)
    c.lineTo(this.toX, this.toY)
    if (this._weight > 0) c.stroke()
    c.closePath()
  }

  update() {}
}

///////////////////////////////////////////////

export class Ellipse extends Object {
  constructor(x, y, width = 50, height = 50, rotation = 0, startAngle = 0, endAngle = 360, counterClockwise = false) {
    super(x, y, width, height)
    this.rotation = rotation * Math.PI / 180
    this.startAngle = startAngle * Math.PI / 180
    this.endAngle = endAngle * Math.PI / 180
    this.counterClockwise = counterClockwise
  }

  draw() {
    c.beginPath()
    c.fillStyle = String(this._fillColor)
    c.strokeStyle = String(this._strokeColor)
    c.lineWidth = String(this._strokeWeight)
    c.ellipse(this.x, this.y, this.width / 2, this.height / 2, this.rotation, this.startAngle, this.endAngle, this.counterClockwise)
    if (this._fillColor != 'none') c.fill()
    if (this._strokeWeight > 0) c.stroke()
    c.closePath()
  }

  update() {}
}

///////////////////////////////////////////////

export class Sprite extends Object {
  constructor(spriteSrc, x, y, scale = 1) {
    super(x, y)
    this.image = new Image()
    this.image.src = spriteSrc
    this.scale = scale
    this.width = this.image.naturalWidth * this.scale
    this.height = this.image.naturalHeight * this.scale
  }

  sprite(spriteSrc) {
    this.image.src = spriteSrc
  }

  scale(scale) {
    this.scale = scale
    this.width = this.image.naturalWidth * this.scale
    this.height = this.image.naturalHeight * this.scale
  }

  draw() {
    c.drawImage(this.image, this.x, this.y, this.width, this.height)
  }

  update() {}
}

///////////////////////////////////////////////

export class Text extends Object {
  constructor(text, x, y, maxWidth = undefined) {
    super(x, y)
    this.text = text
    this._fontSize = '14px'
    this._font = 'serif'
    this._textAlign = 'left'
    this.maxWidth = maxWidth
  }

  fontSize(size) {
    this._fontSize = size
  }

  font(font) {
    this._font = font
  }


  draw() {
    c.beginPath()
    c.fillStyle = String(this._fillColor)
    c.strokeStyle = String(this._strokeColor)
    c.lineWidth = String(this._strokeWeight)
    c.font = this._fontSize + ' ' + this._font
    c.textAlign = this._textAlign
    if (this._fillColor != 'none') c.fillText(this.text, this.x, this.y)
    if (this._strokeWeight > 0) c.strokeText(this.text, this.x, this.y)
    c.closePath()
  }

  update() {}
}

/* 
///////////////////////////////////////////////////////////////////

BACKGROUNDS

///////////////////////////////////////////////////////////////////
*/

let background = null
export class Background {
  constructor(color) {
    this.color = color

    background = this
  }

  color(color) {
    this.color = color
  }

  draw() {
    canvas.style.backgroundColor = this.color
    canvas.style.backgroundSize = 'cover'
    canvas.style.backgroundRepeat = 'no-repeat'
    canvas.style.backgroundPosition = 'center center'
  }
}

export class BackgroundImage {
  constructor(imageSrc) {
    this.image = imageSrc

    background = this
  }

  image(image) {
    this.image = image
  }

  draw() {
    canvas.style.backgroundImage = `url(${this.image})`
    canvas.style.backgroundSize = 'cover'
    canvas.style.backgroundRepeat = 'no-repeat'
    canvas.style.backgroundPosition = 'center center'
  }
}

/* 
///////////////////////////////////////////////////////////////////

RENDERING

///////////////////////////////////////////////////////////////////
*/

export function draw() {
  if (background) background.draw()
  for (const obj of objects) {
    obj.draw()
  }
}

export function init(initCode = () => {}) {
  initCode()
}

export function animate(animationCode, clearCanvas = true) {
  const _animate = () => {
    requestAnimationFrame(_animate)
    if (clearCanvas) c.clearRect(0, 0, canvas.width, canvas.height)

    animationCode()
  }

  init()
  _animate()
}