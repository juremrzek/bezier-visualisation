//Declaration of letiables
const canvas = document.getElementById("canvas");
canvas.height = 800;
canvas.width = 1200;
let ctx = canvas.getContext("2d");
ctx.lineWidth = 2;
let p1 = new Point(100,500); let x = p1.x; let y = p1.y;
let p2 = new Point(800,200);
let p3 = new Point(900,600);
let pA = new Point(p1.x,p1.y);
let pF = new Point(p1.x,p1.y);
let pB = new Point(p2.x,p2.y);
let t = 0;

const bezierAccuracy = 1000; //how often do we redraw canvas - the bigger the number, the more smooth the curve looks
let finalPoints = [];

//when we click somewhere, we change the position of p1.
canvas.addEventListener("click",
    function(event){
        x = event.clientX;
        y = event.clientY;
    }
)
//main loop
mainLoop();
function mainLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear the canvas

    p1.x = x;
    p1.y = y;

    //point A is on the line between p1 and p2, pB is between p2 and p3
    pA.x = p1.x + (p2.x-p1.x)*t;
    pA.y = p1.y + (p2.y-p1.y)*t;
    pB.x = p2.x + (p3.x-p2.x)*t;
    pB.y = p2.y + (p3.y-p2.y)*t;

    ctx.strokeStyle = 'black';
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.stroke();

    if(true){ //do we draw control line?
        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.stroke();
    }

    //final point
    pF.x = pA.x + (pB.x-pA.x)*t;
    pF.y = pA.y + (pB.y-pA.y)*t;
    finalPoints.push(new Point(pF.x, pF.y));
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    finalPoints.forEach( //Loop that draws the bezier curve
        (point, i) => {
            ctx.moveTo(point.x, point.y);
            //ctx.arc(pF.x, pF.y, 2, 0, 2*Math.PI);
            if(i!=0){
                ctx.lineTo(finalPoints[i-1].x, finalPoints[i-1].y);
            }
        }
    )
    if(t!=0){
        ctx.stroke();
    }
    if(t<1){
        t+=1/bezierAccuracy;
        t = Math.round(t*bezierAccuracy)/bezierAccuracy;
    }
    else{
        t=0;
        finalPoints = [];
    }
    
    
    
    drawCircle(pF.x, pF.y);
    drawCircle(pA.x, pA.y);
    drawCircle(pB.x, pB.y);

    window.requestAnimationFrame(mainLoop)
}

function drawCircle(x, y){
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.arc(x, y, 5, 0, 2*Math.PI);
    ctx.stroke();
    ctx.fill();
}

const calculateMidPoint = (t, point1, point2) =>{
    return new Point(
        point1.x + (point2.x-point1.x)*t,
        point1.y + (point2.y-point1.y)*t
    )
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}