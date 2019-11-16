//Declaration of letiables
const canvas = document.getElementById("canvas");
canvas.height = 800;
canvas.width = 1500;
const ctx = canvas.getContext("2d");
ctx.lineWidth = 2;
//-----------------------------
let pointsN = [];
let pointsA = [];
let pointsF = [];
let t = 0;
let bezierAccuracy = 1000;
let finalPoint;

pointsN.push(new Point(100,500));
pointsN.push(new Point(400,200));
pointsN.push(new Point(900,600));
pointsN.push(new Point(1400,300));
pointsN.push(new Point(700,100));
pointsN.push(new Point(100,200));
pointsN.push(new Point(150,100));

let allColors = ["blue","magenta", "green"];
let colorsIndex = 0;
let colors = [];
for(i=0; i<pointsN.length; i++){
    if(i<pointsN.length-2){
        colors.push(allColors[i%allColors.length]);
    }
}

mainLoop();
function mainLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear the canvas

    for(i=1; i<pointsN.length; i++){
        drawLine(pointsN[i-1], pointsN[i], "black"); //Draw stationary lines
        drawCircle(pointsN[i-1].x, pointsN[i-1].y, "rgb(56,56,56)", 12);
    }
    drawCircle(pointsN[pointsN.length-1].x, pointsN[pointsN.length-1].y, "black", 12);
    recursiveCalc(t, pointsN);
    
    pointsF.push(finalPoint);
    for(i=1; i<pointsF.length; i++){
        drawLine(pointsF[i-1], pointsF[i], "red"); //Draw the bezier curve
    }

    //increment t
    if(t<1){
        t+=1/bezierAccuracy;
        t = Math.round(t*bezierAccuracy)/bezierAccuracy;
    }
    else{
        t=0;
        pointsF = [];
    }
    window.requestAnimationFrame(mainLoop);
}

function recursiveCalc(t, tab){ //recursive function to calculate all 
    if(tab.length<=2){
        finalPoint = getPointsA(t, tab)[0];
        drawCircle(finalPoint.x, finalPoint.y, "red", 5);
        return;
    }
    else{
        pointsA = getPointsA(t, tab);
        drawMultipleLines(pointsA, colors[colorsIndex]); //Draws the lines on the screen
        if(colorsIndex >= colors.length-1)
            colorsIndex = 0;
        else
            colorsIndex++;
        //recursive call
        recursiveCalc(t, pointsA);
    }
}

function drawMultipleLines(points, color){
    for(i=1; i<points.length; i++){
        drawLine(points[i-1], points[i], color); //Draw moving lines
        drawCircle(points[i].x, points[i].y, color, 5); //Draw the points
        if(i==1){
            drawCircle(points[i-1].x,points[i-1].y, color, 5)
        }
    }
}

function drawCircle(x, y, color, r){
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.stroke();
    ctx.fill();
}

function getPointsA(t, tab){ //finds a midpoint for every line between points in an array
    points = [];
    for(i=0; i<tab.length; i++){
        if(i>0){
            //Calculate midpoint between stationary points and put it into array
            let currPoint = calculateMidPoint(t, tab[i-1], tab[i]);
            points.push(currPoint);
        }
    }
    return points;
}

function drawLine(point1, point2, color){
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.stroke();
}

function calculateMidPoint(t, point1, point2){
    return new Point(
        point1.x + (point2.x-point1.x)*t,
        point1.y + (point2.y-point1.y)*t
    );
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

//Make it so you can move stationary points by dragging
function intersectsCircle(point, circle, r) {
    return Math.sqrt((point.x-circle.x) ** 2 + (point.y - circle.y) ** 2) <= r;
}
  
canvas.addEventListener("click", function(event) {
    let canvasProperties = canvas.getBoundingClientRect();
    let mousePoint = new Point(event.clientX-canvasProperties.left, event.clientY-canvasProperties.top);
    for(i=0; i<pointsN.length; i++){
        if(intersectsCircle(mousePoint, pointsN[i], 12)) {
            //canvas.style.cursor = "all-scroll";
            console.log("clicked");
        }
    };
  });