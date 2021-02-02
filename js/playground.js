const LEFT = "ArrowLeft";
const RIGHT = "ArrowRight";
const SPACE = "Space";
const GRAVITY = 0.09;
const SPEED = 1;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.font = "12px Arial";
const bug = {  "x": 12, "y": 378, gravity: 0, speed: { x: 0,  y: 0}, state: "fall", power: 0};
ctx.fillStyle = 'black';
ctx.fillText("*", bug.x, bug.y);


// up:  "x": canvas.width - 120, "y": 12
// right:  "x": canvas.width - 13, "y": 20,
// left:  "x": 12, "y": 388,
// down: "x": canvas.width - 120, "y": 388
function loop () {
    // setInterval(updateCanvas, 1000/60);
    updateCanvas();
}

function updateCanvas () {
    // console.log("Updating!!", bug);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    paintLandscape(ctx);
    moveBug();
}

function moveBug () {
    ctx.beginPath();

    ctx.arc(bug.x, bug.y, 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = "black";
    ctx.fill();

    console.log("Right? " , isThereWallRight(bug.x, bug.y));
    console.log("Left? " , isThereWallLeft(bug.x, bug.y));
    console.log("Down? ", isThereWallDown(bug.x, bug.y));
    console.log("Up? ", isThereWallUp(bug.x, bug.y));
}


function paintLandscape(context) {
    ctx.fillStyle = 'green';
    context.fillRect(0, 0, 10, canvas.height);
    context.fillRect(canvas.width - 10, 0, 10, canvas.height);
    context.fillRect(0, canvas.height - 10, canvas.width, 10);
    context.fillRect(0, 0, canvas.width, 10);
    ctx.fillStyle = 'black';
}

function noGround(x, y) {
    const pixelBuffer = new Uint32Array(
      ctx.getImageData(x, y + 1, 1, y).data.buffer
    );
    return pixelBuffer.every(color => color === 0);
  }

function isThereWallRight(x, y) {
    const pixelBuffer = new Uint32Array(
      ctx.getImageData(x + 3, y, 1, 1).data.buffer
    );
        
    return pixelBuffer.some(color => color !== 0);
}

function isThereWallLeft(x, y) {
    const pixelBuffer = new Uint32Array(
      ctx.getImageData(x - 3, y, 1, 1).data.buffer
    );
        
    return pixelBuffer.some(color => color !== 0);
}

function isThereWallDown(x, y) {
    const pixelBuffer = new Uint32Array(
      ctx.getImageData(x, y + 3, 1, 1).data.buffer
    );
        
    return pixelBuffer.some(color => color !== 0);
}

function isThereWallUp(x, y) {
    const pixelBuffer = new Uint32Array(
      ctx.getImageData(x, y - 3, 1, 1).data.buffer
    );
        
    return pixelBuffer.some(color => color !== 0);
}

loop(canvas);