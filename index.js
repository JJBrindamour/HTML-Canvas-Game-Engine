const nerdamer = require('nerdamer')

const canvas = document.getElementById('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

function onResize(resizeCode = () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
}) {
  addEventListener('resize', resizeCode)
}

class Utils {
  static randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  
  static randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
  }
  
  static distance(x1, y1, x2, y2) {
    const xDist = x2 - x1
    const yDist = y2 - y1
  
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
  }
  
  static rotateVelocities(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
  
    return rotatedVelocities;
  }
  
  static resolveElasticCollision(obj, otherObj) {
    const xVelocityDiff = obj.velocity.x - otherObj.velocity.x;
    const yVelocityDiff = obj.velocity.y - otherObj.vy;
  
    const xDist = otherObj.x - obj.x;
    const yDist = otherObj.y - obj.y;
  
    // Prevent accidental overlap of objs
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
  
      // Grab angle between the two colliding objs
      const angle = -Math.atan2(otherObj.y - obj.y, otherObj.x - obj.x);

      // Store mass in var for better readability in collision equation
      const m1 = obj.mass;
      const m2 = otherObj.mass;

      // Velocity before equation
      const u1 = rotate(obj.velocity, angle);
      const u2 = rotate(otherObj.velocity, angle);

      // Velocity after 1d collision equation
      const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
      const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

      // Final velocity after rotating axis back to original location
      const vFinal1 = rotate(v1, -angle);
      const vFinal2 = rotate(v2, -angle);

      // Swap obj velocities for realistic bounce effect
      obj.velocity.x = vFinal1.x;
      obj.velocity.y = vFinal1.y;

      otherObj.velocity.x = vFinal2.x;
      otherObj.velocity.y = vFinal2.y;
    }
  }

  static resolveInelasticCollision(obj, otherObj) {
    otherObj.velocity = obj.velocity = {
      x: (obj.mass * obj.velocity.x + otherObj.mass * otherObj.velocity.x) / (obj.mass + otherObj.mass),
      y: (obj.mass * obj.velocity.y + otherObj.mass * otherObj.velocity.y) / (obj.mass + otherObj.mass),
    }
  }

  static resolveCollision(object, otherObject){
    for (const obj in [object, otherObject]) {
      // elastic
      if (obj.collision == 'elastic') {
        const xVelocityDiff = object.velocity.x - otherObject.velocity.x;
        const yVelocityDiff = object.velocity.y - otherObject.velocity.y;
      
        const xDist = otherObject.x - object.x;
        const yDist = otherObject.y - object.y;
      
        // Prevent accidental overlap of objects
        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
          // Grab angle between the two colliding objects
          const angle = -Math.atan2(otherObject.y - object.y, otherObject.x - object.x);

          // Store mass in var for better readability in collision equation
          const m1 = object.mass;
          const m2 = otherObject.mass;

          // Velocity before equation
          const u1 = this.rotateVelocities(object.velocity, angle);
          const u2 = this.rotateVelocities(otherObject.velocity, angle);

          // Velocity after 1d collision equation
          const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
          const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

          // Final velocity after rotating axis back to original location
          const vFinal1 = this.rotateVelocities(v1, -angle);
          const vFinal2 = this.rotateVelocities(v2, -angle);

          // Swap obj velocities for realistic bounce effect
          if (obj === object) {
            obj.velocity.x = vFinal1.x;
            obj.velocity.y = vFinal1.y;
          } else if (obj === otherObject) {
            obj.velocity.x = vFinal2.x;
            obj.velocity.y = vFinal2.y;
          }
        }
      }
      
      // Inelastic
      if (obj.collision == 'push') {
        obj.velocity = {
          x: (obj.mass * obj.velocity.x + otherObj.mass * otherObj.velocity.x) / (obj.mass + otherObj.mass),
          y: (obj.mass * obj.velocity.y + otherObj.mass * otherObj.velocity.y) / (obj.mass + otherObj.mass),
        }
      }
    }
  }
}

class Object {
  constructor(x, y, rotation, width, height, anchor) {
    this.collider = {
      shape: null,
      width,
      height,
      x,
      y,
    }
    this.debug = false
    this.collision = null
    this.velocity = {
      x: 0,
      y: 0,
    }
    this.mass = 1

    this.x = x
    this.y = y
    this.rotation = rotation
    this.width = width
    this.height = height
    this.anchor = anchor

    objects.push(this)
  }

  setMass(mass) {
    this.mass = mass
  }

  setVx(vx) {
    this.velocity.x = vx
  }

  setVy(vy) {
    this.velocity.x = vy
  }

  setCollider(shape='rect', height=this.height, width=this.height, xShift=this.x, yShift=this.y) {
    this.collider = {
      /*
      Shape Options are:
        -ellipse
        -rect
      */
      shape,
      height,
      width,
      xShift,
      yShift,
    }
  }

  isTouching(obj) {
    if (obj.collider.shape == "ellipse" && this.collider.shape == "ellipse") {
      
    } else if (obj.collider.shape == "rect" && this.collider.shape == "rect") {

    } else if (obj.collider.shape == "ellipse" && this.collider.shape == "rect") {

    } else if (obj.collider.shape == "rect" && this.collider.shape == "ellipse") {

    }
  }

  setCollision(type) {
    this.collision = type
    /*
    Collision types are:
      -elastic (bounce off)
      -push (stick together)
    */
  }

  checkCollisions() {
    for (object in objects) {
      if (this !== object && this.isTouching(object) && this.collision != null) {
        Utils.resolveCollision(this, object)
      }
    }  
  }

  draw() {
    alert("The 'Object' class is only meant for inheritance, not to be called.")
  }

  update() {
    alert("The 'Object' class is only meant for inheritance, not to be called.")
  }
}

class Rect extends Object {
  constructor(x, y, width=50, height=50, anchor="tl") {
    super(x, y, width, height, anchor)
    super.setCollider()
  }

  draw() {

  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.checkCollisions()
    this.draw()
  }
}

class Ellipse {
  constructor(x, y, width=50, height=50, anchor="tl") {
    super(x, y, width, height, anchor)
  }

  draw() {

  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.checkCollisions()
    this.draw()
  }
}

class Text {
  constructor(x, y, width=50, height=50, anchor="tl") {
    super(x, y, width, height, anchor)
  }

  draw() {

  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.checkCollisions()
    this.draw()
  }
}

class Sprite {
  constructor(x, y, width=50, height=50, anchor="tl") {
    super(x, y, width, height, anchor)
  }

  draw() {

  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.checkCollisions()
    this.draw()
  }
}

// Animation Stuff
let objects = []
function init() {
  // Run on Startup everything
}

function animate(animationCode, clearCanvas=true) {
  requestAnimationFrame(animate)
  if (clearCanvas) c.clearRect(0, 0, canvas.width, canvas.height)

  animationCode()
}

/*
animate(() => {
  // Code for animation
})

OR

animate(() => {
  // Code for animation
}, false)
*/