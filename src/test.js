import { Rect, Ellipse, Text, resize, init, animate, draw, Line, Sprite, Background, BackgroundImage, mouse, objects } from './library'

let standStill
let move
resize()

init(() => {
  standStill = new Rect(innerWidth / 2 - 100, innerHeight / 2 - 100, 200, 200)
  move = new Rect(mouse.x, mouse.y)
  move.fill('red')
})

animate(() => {
  move.x = mouse.x - move.width / 2
  move.y = mouse.y - move.height / 2
  if (move.isTouching(standStill)) standStill.fill('sage')
  else standStill.fill('#313131')
  draw()
})
