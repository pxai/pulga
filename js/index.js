const LEFT = "ArrowLeft";
const RIGHT = "ArrowRight";
const SPACE = "Space";
const GRAVITY = 0.09;
const SPEED = 1;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.font = "12px Arial";
const bug = { "x": canvas.width/2, "y": 0, gravity: 0, speed: { x: 0,  y: 0}, state: "fall", power: 0};
ctx.fillText("*", bug.x, bug.y);


document.addEventListener('keydown', function(event) {
    console.log(event.repeat, event);
    if (event.code === SPACE && event.repeat) {
        if (bug.power < 1.4 ) bug.power += 0.1;
        console.log("space " + bug.power);
        ctx.fillText("POWER: " + Math.round(bug.power * 10), 10, 10);
    } else if(event.code === LEFT) {
        console.log('Left was pressed');
        bug.speed.x = -SPEED - bug.power;
        bug.speed.y = -SPEED - bug.power;
        bug.power = 0;
        bug.state = "jump";
    } else if (event.code === RIGHT) {
        console.log('Right was pressed');
        bug.speed.x = SPEED + bug.power;
        bug.speed.y = -SPEED - bug.power;
        bug.power = 0;
        bug.state = "jump";
    } 
});

function loop () {
    setInterval(updateCanvas, 1000/60);
}

function updateCanvas () {
    // console.log("Updating!!", bug);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    moveBug();
}

function moveBug() {
    if (bug.state === "fall") {
        if (bug.y < canvas.height) {
            bug.x += bug.speed.x;
            bug.gravity += GRAVITY;
            bug.y += bug.speed.y + bug.gravity;
            console.log("Bug: ", bug, canvas.height);
        } else {
            bug.speed = { x: 0, y: 0 };
            bug.gravity = 0;
            bug.state = "stop";
        }
    } else if (bug.state === "jump") {
        if (bug.x >= canvas.width || bug.x <= 0) {
            bug.speed = { x: -bug.speed.x, y: bug.speed.y };
            bug.x += bug.speed.x;
        } else if (bug.y  >= canvas.height + 4) {
            bug.gravity = 0;
            bug.speed = { x: 0, y: 0 };
            bug.y -= 2;
            bug.state = "stop";
        } else {
            bug.x += bug.speed.x;
            bug.gravity += 0.02; 
            bug.y += (bug.speed.y + bug.power) + bug.gravity;
            console.log("Bug: ", bug);
        }
    } else if (bug.state === "stop") {
        // console.log("Stop!!");
    }

    ctx.font = "12px Arial";
    ctx.fillText("*", bug.x, bug.y);
    ctx.font = "6px Arial";
    ctx.fillText("bug", bug.x+4, bug.y-8);
}

loop(canvas);