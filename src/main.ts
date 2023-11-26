import './style.css'

const canvas = <HTMLCanvasElement>document.getElementById('myCanvas')
const context = canvas.getContext('2d')

const maxIterations = 1000
const width = canvas.width
const height = canvas.height

function plotMandelbrot() {
  for (let Px = 0; Px < width; Px++) {
    for (let Py = 0; Py < height; Py++) {
      let x0 = ((Px - width / 2) * 4) / width
      let y0 = ((Py - height / 2) * 4) / height

      let x = 0
      let y = 0
      let iteration = 0

      while (x * x + y * y <= 2 * 2 && iteration < maxIterations) {
        let xTemp = x * x - y * y + x0
        y = 2 * x * y + y0
        x = xTemp
        iteration++
      }

      //if reached max iterations then color is 0 else other color is chosen
      let color = iteration === maxIterations ? 0 : iteration % 265

      if (context) {
        context.fillStyle = 'rgb(' + color + ',' + color + ',' + color + ')'
        context.fillRect(Px, Py, 1, 1)
      }
    }
  }
}

plotMandelbrot()
