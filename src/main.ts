import './style.css'

const canvas = <HTMLCanvasElement>document.getElementById('myCanvas')
const context = canvas.getContext('2d')

const maxIterations = 1000
const width = canvas.width
const height = canvas.height
let scale = 3
let offsetX = -160
let offsetY = 0

// Variables for mouse dragging
let isDragging = false
let dragStartX = 0
let dragStartY = 0

function plotMandelbrot() {
  for (let Px = 0; Px < width; Px++) {
    for (let Py = 0; Py < height; Py++) {
      let x0 = ((Px - width / 2 + offsetX) * scale) / width
      let y0 = ((Py - height / 2 + offsetY) * scale) / height

      //optimized version
      let x = 0
      let y = 0
      let x2 = 0
      let y2 = 0
      let iteration = 0

      //calculate whether complex number x0 + y0 is in Mandelbrod set or not
      while (x2 + y2 <= 4 && iteration < maxIterations) {
        y = 2 * x * y + y0
        x = x2 - y2 + x0
        x2 = x * x
        y2 = y * y
        iteration++
      }

      //unoptimized version
      /*

      let x = 0
      let y = 0
      let iteration = 0

      //calculate whether complex number x0 + y0 is in Mandelbrod set or not
      while (x * x + y * y <= 2 * 2 && iteration < maxIterations) {
        let xTemp = x * x - y * y + x0
        y = 2 * x * y + y0
        x = xTemp
        iteration++
      }

      */

      //if reached max iterations then color is 0 else other color is chosen
      let color = iteration === maxIterations ? 0 : iteration % 265

      if (context) {
        context.fillStyle = 'rgb(' + color + ',' + color + ',' + color + ')'
        context.fillRect(Px, Py, 1, 1)
      }
    }
  }
}

function handleWheel(event: any) {
  let delta = event.deltaY || event.detail || event.wheelDelta
  let zoomFactor = delta > 0 ? 0.9 : 1.1

  // Calculate the position of the mouse in the fractal coordinates
  let mouseX = event.clientX - canvas.getBoundingClientRect().left
  let mouseY = event.clientY - canvas.getBoundingClientRect().top

  // Update offsets based on the mouse position and zoom factor
  offsetX += (mouseX - canvas.width / 2 + offsetX) * (1 - zoomFactor)
  offsetY += (mouseY - canvas.height / 2 + offsetY) * (1 - zoomFactor)

  // Adjust the scale based on the zoom factor
  scale *= zoomFactor

  plotMandelbrot()
}

function handleMouseDown(event: any) {
  isDragging = true
  dragStartX = event.clientX
  dragStartY = event.clientY
}

function handleMouseMove(event: any) {
  if (isDragging) {
    let deltaX = event.clientX - dragStartX
    let deltaY = event.clientY - dragStartY

    offsetX -= deltaX
    offsetY -= deltaY

    dragStartX = event.clientX
    dragStartY = event.clientY

    plotMandelbrot()
  }
}

function handleMouseUp() {
  isDragging = false
}

// Add event listeners for mouse interaction
canvas.addEventListener('wheel', handleWheel)
canvas.addEventListener('mousedown', handleMouseDown)
canvas.addEventListener('mousemove', handleMouseMove)
canvas.addEventListener('mouseup', handleMouseUp)

plotMandelbrot()
