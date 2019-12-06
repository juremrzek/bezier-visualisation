//Declaration of variables
const canvas = document.getElementById("canvas");
const canvasDiv = document.getElementById("canvasDiv");
canvas.height = 850;
canvas.width = 1300;
const ctx = canvas.getContext("2d");
ctx.lineWidth = 3;
const popupButton = document.getElementById("popupButton");

let pointsN = [];
let pointsA = [];
let pointsF = [];
let t = 0;
let bezierAccuracy = 500;
let finalPoint;
let mouse = new Point(0, 0);
const finalLineWidth = 4;
const midLineWidth = 2;
const staticLineWidth = 5;
const circleOutlineWidth = 8;

const showLines = document.getElementById("showLines");
const sliderX = document.getElementById("sliderX");
const sliderY = document.getElementById("sliderY");
const xPos = document.getElementById("xPos");
const yPos = document.getElementById("yPos");
const addPointButton = document.getElementById("addPointButton");
const pointsDiv = document.getElementById("pointsDiv"); //This element displays all of the points' coordinates
const tooManyPointsMessage = document.getElementById("tooManyPointsMessage");
let tempFinalPoint = new Point(0, 0);
let pointsDivArr = [];

sliderX.value = (Math.random()*canvas.width-20)+20; //When we first enter the page, the sliders will be set to random values
sliderY.value = (Math.random()*canvas.height-20)+20;

pointsN.push(new Point(370, 420));
pointsN.push(new Point(160, 800));
pointsN.push(new Point(1100, 270));

pointsN.forEach((element, i) => {
    displayNewPoint(element[i]);
});


const colors = ["#1e1f26", "#283655","#4d648d"]; //colors to draw helping lines with
let colorsIndex = 0;

for(let i=0; i<pointsN.length; i++){
    pointsN.isDragging = false;
}

//-------------------------------------------------------------------------------------------------------------------------
function mainLoop(){
    colorsIndex = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear the canvas

    xPos.innerHTML = "X: "+sliderX.value; //Change the html text on sliders
    yPos.innerHTML = "Y: "+sliderY.value;

    for(let i=1; i<pointsN.length; i++){
        drawLine(pointsN[i-1], pointsN[i], "black", staticLineWidth); //Draw stationary lines
        drawCircle(pointsN[i-1].x, pointsN[i-1].y, "black", "#CFD8DC", 12);
    }
    drawCircle(pointsN[pointsN.length-1].x, pointsN[pointsN.length-1].y, "black", "#CFD8DC", 12);
    calcFinalPoint(t, pointsN); //calculates point that  draws the bezier
    pointsF.push(finalPoint);
    for(let i=1; i<pointsF.length; i++){
        drawLine(pointsF[i-1], pointsF[i], "red", finalLineWidth); //Draw the bezier curve
    }

    for(let i=0; i<pointsN.length; i++){
        if(pointsN[i].isDragging){
            pointsN[i].x = mouse.x; 
            pointsN[i].y = mouse.y;
            pointsDivArr[i].getElement().children[0].innerHTML = pointsDivArr[i].getElement().children[0].innerHTML.charAt(0) + coordinatesToString(pointsN[i]);
        }
    }
    calculateBezierAgain(t);

    //set cursor
    let anyPointIsHovered = false;
    let anyPointIsDragging = false;
    for(let i=0; i<pointsN.length; i++){
        if(intersectsCircle(mouse, pointsN[i], 20))
            anyPointIsHovered = true;
        if(pointsN[i].isDragging){
            anyPointIsDragging = true;
        }
    }
    if(anyPointIsHovered)
        canvas.style.cursor = "grab";
    else
        canvas.style.cursor = "default";
    if(anyPointIsDragging)
       canvas.style.cursor = "grabbing";
    //---
    
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
}//--------------------------------------------------------------------------------------------------------------------------------------

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
    for(let i=1; i<points.length; i++){
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
    for(let i=1; i<tab.length; i++){
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
    for(let i=0; i<pointsN.length; i++){
        pointsN[i].isDragging = false;
    }
    canvas.style.cursor = "grab";
});

canvas.addEventListener("mousedown", () => {
    const intersecting = pointsN.filter(point => intersectsCircle(mouse, point, 20));
    if(intersecting.length > 0) {
        intersecting[intersecting.length -1].isDragging = true;
        canvas.style.cursor = "grabbing";
    }
});

canvasDiv.addEventListener("mousemove", (event) => {
    const canvasProperties = canvas.getBoundingClientRect();
    mouse.x = event.clientX - canvasProperties.left;
    mouse.y = event.clientY-canvasProperties.top;
    if(mouse.x <= 0 || mouse.y <= 0 || mouse.x >= canvas.width || mouse.y >= canvas.height){
        for(let i=0; i<pointsN.length; i++){
            pointsN[i].isDragging = false;
        }
    }
});

//Add a new point when we click the button
addPointButton.addEventListener("click", () => {
    if(pointsN.length<=25){
        pointsN.push(new Point(+sliderX.value,+sliderY.value));
        displayNewPoint();
        sliderX.value = Math.random()*canvas.width+20;
        sliderY.value = Math.random()*canvas.height+20;
        console.log();
        calculateBezierAgain(t);
        tooManyPointsMessage.style.visibility = "hidden";
    }
    else{
        tooManyPointsMessage.style.color = "#D8000C";
        tooManyPointsMessage.style.visibility = "visible";
    }
    
});

popupButton.addEventListener("click", () => {
    mainLoop();
    document.getElementById("popup").style.display = "none";
    canvasDiv.style.pointerEvents = "auto";
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
    for(let i=1; i<pointsF.length; i++){
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

//Make it so the points are displayed in the pointsDiv
function displayNewPoint(point){
    let div = document.createElement("div");
    div.className = "displayPoints";
    let span = document.createElement("span");
    span.className="displayCoordinates";
    div.append(span);

    let deleteButton = document.createElement("span");
    deleteButton.innerHTML = "&times";
    deleteButton.className = "deleteButton";
    div.append(deleteButton);
    
    const pointDiv = new PointDiv(div, pointsDiv);
    pointsDivArr.push(pointDiv);
    pointsDiv.appendChild(pointDiv.getElement());
    recalculateDisplayedPoints();
    deleteButton.addEventListener("click", () => {
        if(pointsN.length>2){ //We need to have at least 2 points at once
            pointDiv.delete();
            pointsN = pointsN.filter(p => p!=pointsN[pointsDivArr.indexOf(pointDiv)]);
            pointsDivArr = pointsDivArr.filter(p => p != pointDiv);
            tooManyPointsMessage.style.visibility = "hidden";
            recalculateDisplayedPoints();
        }
    });
}
function recalculateDisplayedPoints(){
    let char;
    for(let i=0; i<pointsDivArr.length; i++){
        if(i==0){
            pointsDivArr[i].getElement().children[0].innerHTML = "A"+coordinatesToString(pointsN[i]);
        }
        else{
            char = String.fromCharCode(pointsDivArr[i-1].getElement().children[0].innerHTML.charAt(0).charCodeAt(0)+1);
            pointsDivArr[i].getElement().children[0].innerHTML = char+coordinatesToString(pointsN[i]);
        }
    }
}
function coordinatesToString(point){
    return "("+Math.floor(point.x)+", "+Math.floor(point.y)+")";
}