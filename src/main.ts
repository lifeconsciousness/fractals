import './style.css'

const canvas = <HTMLCanvasElement>document.getElementById('myCanvas')
const context = canvas.getContext('2d')

const maxIterations = 100
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

      // Use continuous coloring
      var smoothColor = iteration + 1 - Math.log(Math.log(Math.sqrt(x * x + y * y))) / Math.log(2)

      // Map the smooth color to the HSL color space
      var hue = (smoothColor % 256) / 256
      var saturation = 1
      var lightness = iteration === maxIterations ? 0 : 0.5

      // Convert HSL to RGB
      var rgb = hslToRgb(hue, saturation, lightness)

      if (context) {
        context.fillStyle = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'
        context.fillRect(Px, Py, 1, 1)
      }
    }
  }
}

function hslToRgb(h: number, s: number, l: number) {
  var r, g, b

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    var hue2rgb = function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s
    var p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
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
