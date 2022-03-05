import { Rect, Ellipse, Text, resize, init, animate, draw, Line, Sprite, Background, BackgroundImage } from './library'

resize()

init(() => {
  const r = new Rect(50, 50)
  r.fill('red')

  const t = new Text('Hello World', 100, 500)
  t.fontSize('100px')
  t.font('arial')
  t.fill('pink')
  t.strokeColor('black')
  t.strokeWeight(3)

  const l = new Line(20, 20, 75, 195, 8, 'round')
  l.strokeColor('sage')

  const i = new Sprite('../img/nebula2.jpg', 300, 50, 0.05)

  const e = new Ellipse(250, 250, 100)
  e.strokeColor('navy')
  e.strokeWeight(8)
  e.fill('none')

  const bi = new BackgroundImage('../img/nebula1.jpg')
  const b = new Background('darkred')
})

animate(() => {
  draw()
})
