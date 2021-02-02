const LEFT = "ArrowLeft";
const RIGHT = "ArrowRight";
const SPACE = "Space";
const GRAVITY = 0.09;
const SPEED = 1;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.font = "12px Arial";
const rocks = generateRocks(10);
const bug = { "x": canvas.width/2, "y": 25, gravity: 0, speed: { x: 0,  y: 0}, state: "fall", power: 0};
paintBug();
const audio = { 
    jump: new Audio('sound/jump.mp3'),
    bounce: new Audio('sound/bounce.mp3'), 
    ground: new Audio('sound/ground.mp3'),
    power: new Audio('sound/power.mp3')
};


document.addEventListener('keydown', function(event) {
    console.log(event.repeat, event);
    if (bug.state === "stop" || bug.state === "power") {
        if (event.code === SPACE && event.repeat) {
            if (bug.power < 1.4 ) bug.power += 0.1;
            console.log("space " + bug.power);
            ctx.fillText("POWER: " + Math.round(bug.power * 10), 10, 10);
            bug.state = "power";
            audio.power.play();
        } else if(event.code === LEFT) {
            bug.speed.x = -SPEED - bug.power;
            bug.speed.y = -SPEED - bug.power;
            bug.power = 0;
            bug.state = "jump";
            audio.jump.play();
            console.log('Left was pressed: ', bug.speed, bug);
        } else if (event.code === RIGHT) {
            bug.speed.x = SPEED + bug.power;
            bug.speed.y = -SPEED - bug.power;
            bug.power = 0;
            bug.state = "jump";
            audio.jump.play();
            console.log('Right was pressed: ', bug.speed, bug);
        }
    } 
});

function loop () {
    setInterval(updateCanvas, 1000/60);
}

function updateCanvas () {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    paintLandscape(ctx);
    moveBug();
}

function moveBug() {
    if (bug.state === "fall") {
        if (isThereWallDown(bug.x, bug.y)) { 
            bug.speed = { x: 0, y: 0 };
            bug.gravity = 0;
            bug.state = "stop";
            audio.ground.play();
            console.log("Bug stopped on fall: ", JSON.parse(JSON.stringify(bug)),  JSON.parse(JSON.stringify(bug)).speed, canvas.height);
        } else {
            bug.x += bug.speed.x;
            bug.gravity += GRAVITY;
            bug.y += bug.speed.y + bug.gravity;
            console.log("Bug down: ", JSON.parse(JSON.stringify(bug)),  JSON.parse(JSON.stringify(bug)).speed, canvas.height);
        }
    } else if (bug.state === "jump" || bug.state === "move") {
        if (isThereWallDown(bug.x, bug.y) && bug.state !== "jump") {
            console.log("Bug d: ", bug);
            bug.gravity = 0;
            bug.speed = { x: 0, y: 0 };
            bug.state = "stop";
            audio.ground.play();
            console.log("WALL down ", JSON.parse(JSON.stringify(bug)),  JSON.parse(JSON.stringify(bug)).speed);
        } else if (isThereWallRight(bug.x, bug.y) && bug.speed.x > 0) { //(bug.x >= canvas.width || bug.x <= 0) {
            bug.state = "move";
            bug.speed = { x: -bug.speed.x, y: bug.speed.y };
            bug.speed.x = -0.2;
            bug.x += bug.speed.x;
            audio.bounce.play();
            console.log("WALL right!! ", JSON.parse(JSON.stringify(bug)),  JSON.parse(JSON.stringify(bug)).speed);
        } else if (isThereWallLeft(bug.x, bug.y) && bug.speed.x < 0) {
            bug.state = "move";
            bug.speed = { x: -bug.speed.x, y: bug.speed.y };
            bug.speed.x = 0.2;
            bug.x += bug.speed.x;
            audio.bounce.play();
            console.log("WALL left!! ", JSON.parse(JSON.stringify(bug)),  JSON.parse(JSON.stringify(bug)).speed);
        } else if (isOut(bug.y)) {
            showGameOver();
        } else {
            bug.state = "move";
            bug.x += bug.speed.x;
            bug.gravity += 0.02; 
            bug.y += (bug.speed.y + bug.power) + bug.gravity;
            console.log("Bug move: ", JSON.parse(JSON.stringify(bug)),  JSON.parse(JSON.stringify(bug)).speed);
        }
    }
    paintBug();
    paingPowerBar();

    //ctx.font = "12px Arial";
    //ctx.fillText("*", bug.x, bug.y);
    // ctx.font = "6px Arial";
    //ctx.fillText("bug", bug.x+4, bug.y-8);
}

function showGameOver() {
    bug.state = "over";
}
function generateRocks (density = 5) {
    return Array(density).fill().map(i => {
        const x = random(0, canvas.width);
        const y = random(0, canvas.height);
        const width = random(20, canvas.width / 4);
        const height = random(width, width - random(1, 20));
        console.log("Generated_ ", { x, y, width, height });
        return { x, y, width, height };
    });
}

function paintRocks () {
    ctx.fillStyle = "green";
    rocks.forEach( rock => {
        ctx.fillRect(rock.x, rock.y, rock.width, rock.height);
    });
}

function random (min, max) {
    return Math.round(Math.random() * (max-min)) + min;
}

function paintBug() {
    ctx.beginPath();
    ctx.arc(bug.x, bug.y, 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = "black";
    ctx.fill();
}

function paingPowerBar () {
    if (bug.state !== "power") return;
    ctx.fillStyle = "white";
    for (let i = 0; i < 1.4 * 20; i++) {
        ctx.fillRect(2 + (4 + (i * 5)), canvas.height - 10, 4, 8);
    }

    ctx.fillStyle = "black";
    for (let i = 0; i < bug.power * 20; i++) {
        ctx.fillRect(2 + (4 + (i * 5)), canvas.height - 10, 4, 8);
    }
}

function paintLandscape(context) {
    ctx.fillStyle = 'green';
    context.fillRect(0, 0, 10, canvas.height);
    context.fillRect(canvas.width - 10, 0, 10, canvas.height);
    context.fillRect(0, canvas.height - 10, canvas.width, 10);
    ctx.fillStyle = 'black';
    paintRocks();
}

function isOut(y) {
    return bug.y < 0;
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
      ctx.getImageData(x, y + 6, 1, 1).data.buffer
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