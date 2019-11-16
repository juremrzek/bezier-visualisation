//Declaration of letiables
const canvas = document.getElementById("canvas")
canvas.height = 800
canvas.width = 1200
const ctx = canvas.getContext("2d")
ctx.lineWidth = 2
//-----------------------------
let points = []

points.push(new Point(100,500))
points.push(new Point(400,200))
points.push(new Point(900,600))

function Point(x, y) {
    this.x = x
    this.y = y
}