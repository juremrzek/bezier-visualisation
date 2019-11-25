//Declaration of letiables
const canvas = document.getElementById("canvas");
const canvasDiv = document.getElementById("canvasDiv");
canvas.height = 800;
canvas.width = 1200;
const ctx = canvas.getContext("2d");
ctx.lineWidth = 3;
//-----------------------------
let pointsN = [];
let pointsA = [];
let pointsF = [];
let t = 0;
let bezierAccuracy = 1000;
let finalPoint;
let mouse = new Point(0, 0);
let finalLineWidth = 4;
let midLineWidth = 2;
let staticLineWidth = 5;
let circleOutlineWidth = 8;

const showLines = document.getElementById("showLines");
const sliderX = document.getElementById("sliderX");
const sliderY = document.getElementById("sliderY");
let xPos = document.getElementById("xPos");
let yPos = document.getElementById("yPos");
let addPointButton = document.getElementById("addPointButton");
let tempFinalPoint = new Point(0, 0);

sliderX.value = Math.random()*canvas.width;
sliderY.value = Math.random()*canvas.height;

for(let i=0; i<5; i+=1){
    let tempPoint = new Point(Math.random()*(canvas.width-20)+20, Math.random()*(canvas.height-20)+20);
    pointsN.push(tempPoint)
}

const allColors = ["#727a17", "#ffc500","#FF6347"];
//const allColors = ["#2ecc71", "#e67e22","#9b59b6"];
let colorsIndex = 0;
let colors = [];
for(let i=0; i<pointsN.length; i++){
    if(i<pointsN.length-2){
        colors.push(allColors[i%allColors.length]);
    }
}
for(let i=0; i<pointsN.length; i++){
    pointsN.isDragging = false;
}

mainLoop();
function mainLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear the canvas

    xPos.innerHTML = "X: "+sliderX.value; //Change the html text on sliders
    yPos.innerHTML = "Y: "+sliderY.value;

    for(i=1; i<pointsN.length; i++){
        drawLine(pointsN[i-1], pointsN[i], "black", staticLineWidth); //Draw stationary lines
        drawCircle(pointsN[i-1].x, pointsN[i-1].y, "black", "#ecf0f1", 12);
    }
    drawCircle(pointsN[pointsN.length-1].x, pointsN[pointsN.length-1].y, "black", "#ecf0f1", 12);
    
    calcFinalPoint(t, pointsN); //calculates point that  draws the bezier
    pointsF.push(finalPoint);
    for(i=1; i<pointsF.length; i++){
        drawLine(pointsF[i-1], pointsF[i], "red", finalLineWidth); //Draw the bezier curve
    }

    for(i=0; i<pointsN.length; i++){
        if(pointsN[i].isDragging){
            pointsN[i].x = mouse.x; 
            pointsN[i].y = mouse.y;
        }
    }
    calculateBezierAgain(t);
    
    //increment t
    if(t<1){
        t+=1/bezierAccuracy;
        t = Math.round(t*bezierAccuracy)/bezierAccuracy;
    }
    else{
        t=0;
        pointsF = [];
    }
    setTimeout(function() {
        window.requestAnimationFrame(mainLoop);
      }, 1000 / 60);
}

function calcFinalPoint(t, tab){ //recursive function to calculate final point
    if(tab.length<=2){
        finalPoint = getPointsA(t, tab)[0];
        drawCircle(finalPoint.x, finalPoint.y, "red", "red", 3);
        return;
    }
    else{
        pointsA = getPointsA(t, tab);
        if(showLines.checked) {
            drawMultipleLines(pointsA, colors[colorsIndex], midLineWidth); //Draws the lines on the screen
            if(colorsIndex >= colors.length-1)
                colorsIndex = 0;
            else
                colorsIndex++;
        }
        //recursive call
        calcFinalPoint(t, pointsA);
    }
}

function drawMultipleLines(points, color, lineWidth){
    for(i=1; i<points.length; i++){
        drawLine(points[i-1], points[i], color, lineWidth); //Draw moving lines
        drawCircle(points[i].x, points[i].y, color, color, 3); //Draw the points
        if(i==1){
            drawCircle(points[i-1].x,points[i-1].y, color, color, 3)
        }
    }
}

function drawCircle(x, y, colorStroke, colorFill, r){
    ctx.lineWidth = circleOutlineWidth;
    ctx.beginPath();
    ctx.strokeStyle = colorStroke;
    ctx.fillStyle = colorFill;
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.stroke();
    ctx.fill();
}

function getPointsA(t, tab){ //finds a midpoint for every line between points in an array
    let points = [];
    for(i=1; i<tab.length; i++){
        //Calculate midpoint between stationary points and put it into array
        points.push(calculateMidPoint(t, tab[i-1], tab[i]));
    }
    return points;
}

function drawLine(point1, point2, color, lineWidth){
    ctx.lineWidth = lineWidth;
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

//Make it so you can move stationary points by dragging------------
function intersectsCircle(point, circle, r) {
    return Math.sqrt((point.x-circle.x) ** 2 + (point.y - circle.y) ** 2) <= r;
}

canvas.addEventListener("mouseup", function() {
    for(i=0; i<pointsN.length; i++){
        pointsN[i].isDragging = false;
    }
});

canvas.addEventListener("mousedown", function() {
    const intersecting = pointsN.filter(point => intersectsCircle(mouse, point, 20));
    if(intersecting.length > 0)
        intersecting[intersecting.length -1].isDragging = true;
});

canvasDiv.addEventListener("mousemove", function(event){
    const canvasProperties = canvas.getBoundingClientRect();
    mouse.x = event.clientX - canvasProperties.left;
    mouse.y = event.clientY-canvasProperties.top;
    if(mouse.x <= 0 || mouse.y <= 0 || mouse.x >= canvas.width || mouse.y >= canvas.height){
        for(i=0; i<pointsN.length; i++){
            pointsN[i].isDragging = false;
        }
    }
});

//Add a new point when we click the button
addPointButton.addEventListener("click", function(){
    pointsN.push(new Point(+sliderX.value,+sliderY.value));
    console.log(pointsN);
    colors = [];
    for(i=0; i<pointsN.length; i++){
        if(i<pointsN.length-2){
            colors.push(allColors[i%allColors.length]);
        }
    }
    sliderX.value = Math.random()*canvas.width;
    sliderY.value = Math.random()*canvas.height;
    calculateBezierAgain(t);
});


//Make it so when you change position of a point, the whole bezier redraws----------
function calculateBezierAgain(t){
    let tempT = 0;
    pointsF = [];
    while(tempT<t){
        calcTempFinalPoint(tempT, pointsN);
        pointsF.push(tempFinalPoint);
        tempT +=1/bezierAccuracy;
        tempT = Math.round(tempT*bezierAccuracy)/bezierAccuracy;
    }
    for(i=1; i<pointsF.length; i++){
        drawLine(pointsF[i-1], pointsF[i], "red"); //Draw the bezier curve
    }
}
function calcTempFinalPoint(t, tab){ //recursive function to calculate final point
    if(tab.length<=2){
        tempFinalPoint = getPointsA(t, tab)[0];
        return;
    }
    else{
        let tempPointsA = getPointsA(t, tab);
        //recursive call
        calcTempFinalPoint(t, tempPointsA);
    }
}