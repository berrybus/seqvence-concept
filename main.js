// Please don't look at this I am not a JS developer
// nor did I think very hard about the algorithm

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const desiredColors = ["blue", "blue", "red", "blue", "blue", "blue", "red", "blue", "blue", "blue"];
// Apparently JS doesn't have tuples??
const posX = [];
const posY = [];

const lastClickX = [];
const lastClickY = [];
const lastColors = [];

const colorQueueHeight = 100
const colorBubbleRadius = 20

canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
})

const a = 2 * Math.PI / 6;
const r = 30;

function init() {
	initializeGrid(canvas.width, canvas.height - colorQueueHeight);
	drawColorQueue();
}
init();

function drawColorQueue() {
	for (var i = 0; i < lastClickX.length; i++) {
		ctx.beginPath();
		ctx.arc(30 + 2.5*i*colorBubbleRadius, canvas.height - 50, colorBubbleRadius, 0, 2 * Math.PI);
		ctx.fillStyle = "gray";
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'black';
		ctx.stroke(); 
		ctx.fill();
	}
	for (var i = lastClickX.length; i < desiredColors.length; i++) {
		ctx.beginPath();
		ctx.arc(30 + 2.5*i*colorBubbleRadius, canvas.height - 50, colorBubbleRadius, 0, 2 * Math.PI);
		ctx.fillStyle = desiredColors[i];
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'black';
		ctx.stroke(); 
		ctx.fill();
	}
}

function drawHexagon(x, y, fillColor) {
	ctx.beginPath();
	for (var i = 0; i < 6; i++) {
		ctx.lineTo(x + r * Math.sin(a * i), y + r * Math.cos(a * i));
	}
	ctx.closePath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'black';
	ctx.stroke();
	ctx.fillStyle = fillColor;
	ctx.fill();
}

function drawLine(x1, y1, x2, y2) {
	console.log("from X: " + x1 + "from Y: " + y1);
	console.log("to X: " + x2 + "to Y: " + y2);
	ctx.lineWidth = 10;
	ctx.strokeStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function initializeGrid(width, height) {
	let xInc = r*Math.sqrt(3)
	for (let x = r; x < width; x += xInc) {
		for (let y = r; y < height; y += r*3) {
			console.log("x: " + x + " y: " + y);
			posX.push(x);
			posY.push(y);
		}
	}
	for (let x = r + r/2*Math.sqrt(3); x < width; x += xInc) {
		for (let y = r + 1.5*r; y < height; y += r*3) {
			console.log("x: " + x + " y: " + y);
			posX.push(x);
			posY.push(y);
		}
	}
	drawGrid();
}

function drawGrid() {
	for (var i = 0; i < posX.length; i++) {
		drawHexagon(posX[i], posY[i], "white");
	}
  
	for (var i = 0; i < lastClickX.length; i++) {
		drawHexagon(lastClickX[i], lastClickY[i], lastColors[i]);
		if (i > 0) {
			drawLine(lastClickX[i - 1], lastClickY[i - 1], lastClickX[i], lastClickY[i]);
		}
	}
}

// XXXXXXXXXX: Do not look
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
	if (y > canvas.height - colorQueueHeight) {
		return;
	}
	var minDist = Number.POSITIVE_INFINITY;
	var idx = 0;
	for (var i = 0; i < posX.length; i++) {
		let newDist = Math.sqrt((x - posX[i])**2 + (y - posY[i])**2);
		if (newDist < minDist) {
			minDist = newDist;
			idx = i;
		}
	}

	if (lastClickX.length <= 0) {
		lastClickX.push(posX[idx]);
		lastClickY.push(posY[idx]);
		lastColors.push(desiredColors[0]);
	} else if (lastClickX.length < desiredColors.length) {
		let lastX = lastClickX[lastClickX.length - 1];
		let lastY = lastClickY[lastClickY.length - 1];
		let newDist = Math.sqrt((lastX - posX[idx])**2 + (lastY - posY[idx])**2);
		var alreadyClicked = false;
		for (var i = 0; i < lastClickX.length; i++) {
			if (lastClickX[i] == posX[idx] && lastClickY[i] == posY[idx]) {
				alreadyClicked = true;
			}
		}
		if (lastX == posX[idx] && lastY == posY[idx]) {
			lastClickX.pop();
			lastClickY.pop();
			lastColors.pop();

		} else if (newDist < r * 2 && !alreadyClicked) {

			lastClickX.push(posX[idx]);
			lastClickY.push(posY[idx]);
			lastColors.push(desiredColors[lastClickX.length - 1]);
		}
	} else {
		let lastX = lastClickX[lastClickX.length - 1];
		let lastY = lastClickY[lastClickY.length - 1];
		if (lastX == posX[idx] && lastY == posY[idx]) {

			lastClickX.pop();
			lastClickY.pop();
			lastColors.pop();
		}
	}
	drawGrid();
	drawColorQueue()
}