var canvas;
var ctx;
var snake;
var balls = [];
var powerUps = [];
var score = 0;
var lastPower = 0;
const MENU = "MENU";
const ARCADE = "ARCADE";
const PRO = "PRO";
const TRIBALL = "TRIBALL";
const TACTIC = "TACTIC";
var mode = MENU;
var audio = {};
var kongregate;
var muted = false;
var powers = {
	explo: 0,
	slice: 0
}
const maxPowers = {
	explo: 1000,
	slice: 500
}

function main() {
	ajax.enter();
	for (var i = 0; i < 10; ++i) {
		let audioArray = [];
		for (var j = 0; j < 5; ++j) {
			let a = new Audio();
			a.src = "sounds/tile" + i + ".wav";
			audioArray.push(a);
		}
		audioArray.index = 0;
		audio["tile" + i] = audioArray;
	}
	for (var i = 0; i < 3; ++i) {
		let audioArray = [];
		for (var j = 0; j < 5; ++j) {
			let a = new Audio();
			a.src = "sounds/expl" + i + ".wav";
			audioArray.push(a);
		}
		audioArray.index = 0;
		audio["expl" + i] = audioArray;
	}
	audio.ded = new Audio();
	audio.ded.src = "sounds/ded.wav";
	
	canvas = $("#game")[0];
	ctx = canvas.getContext('2d');
	snake = Object.create(Snake);
	for (var i = 0; i < 3; ++i) {
		balls.push(Object.create(Ball));
	}
	
	$("body").keydown(function(e) {
		if (e.keyCode === 27) {
			return makeMenu();
		}
		
		
		let newDir = e.keyCode - 37;
		/*if (newDir > -1 && newDir < 5 && (newDir - snake.dir) % 2 != 0) {
			snake.dir = newDir;
		}*/
		if (newDir > -1 && newDir < 5) {
			if ((newDir - (snake.dirQueue.length > 0 ? snake.dirQueue[snake.dirQueue.length - 1] : snake.dir)) % 2 !== 0) {
				snake.dirQueue.push(newDir);
				console.log(snake.dirQueue);
			}
		}
		else if (mode !== MENU && snake.ded) {
			return restart();
		}
		
	});
	
	makeMenu();
	
	update();
}

function tileSound() {
	if (!muted) {
		let a = audio["tile" + Math.floor(Math.random() * 10)];
		if (mode === MENU) {
			a.every(a => a.volume = .3);
		}
		else {
			a.every(a => a.volume = 1);
		}
		a[a.index++].play();
		a.index %= 5;
	}
}
function explSound() {
	if (!muted) {
		let a = audio["expl" + Math.floor(Math.random() * 3)];
		a[a.index++].play();
		a.index %= 5;
	}
}

function update() {
	requestAnimationFrame(update);
	snake.update();
	
	for (p in powerUps) {
		let powerUp = powerUps[p];
		powerUp.update();
		if (powerUp.x === snake.x && powerUp.y === snake.y) {
			powerUp.pick();
		}		
		if (powerUp.life > powerUp.maxLife) {
			powerUps.splice(p, 1);
		}
	}
	for(ball of balls) {
		ball.update();
	}
	for (var f in fadeTiles) {
		fadeTiles[f].update();
		if (fadeTiles[f].life > fadeTiles[f].maxLife) {
			fadeTiles.splice(f, 1);
		}
	}
	powers.explo -= Math.sign(powers.explo);
	powers.slice -= Math.sign(powers.slice);
	draw();
	++lastPower;
	if (Math.random() < 0.001 + lastPower * .00001 && !snake.ded && mode === ARCADE) {
		lastPower = 0;
		console.log("new explosive powerup");
		powerUps.push(Object.create(PowerUps[Math.floor(Math.random() * PowerUps.length)]));
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "red";
	ctx.fillRect(20, 0, maxx * tilew * (powers.explo / maxPowers.explo), 20);
	ctx.fillStyle = "blue";
	ctx.fillRect(20, 20 + maxy * tilew, maxx * tilew * (powers.slice / maxPowers.slice), 20);
	ctx.save();
	ctx.translate(20, 20);
	ctx.beginPath();
	ctx.rect(0, 0, maxx * tilew, maxy * tilew);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.clip();
	grid.draw();
	for(ball of balls) {
		ball.draw();
	}
	for (powerUp of powerUps) {
		powerUp.draw();
	}
	ctx.font = "300px Arial";
	ctx.fillStyle = snake.ded ? "rgba(128, 128, 128, 0.9)" : "rgba(255, 255, 255, 0.1)";
	ctx.textAlign = "center";
	if (mode !== MENU) {
		ctx.fillText(score, maxx * tilew * .5, maxy * .8 * tilew);
		if (snake.ded) {
			ctx.font = "40px Arial";
			ctx.fillStyle = "rgba(128, 128, 128, 0.7)";
			ctx.fillRect(5, maxy * .85 * tilew, maxx * tilew - 10, tilew * maxy * .12);
			ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
			ctx.fillText("R to restart, Esc to menu", maxx * tilew * .5, maxy * .95 * tilew);
			
		}
	}
	for (var f in fadeTiles) {
		fadeTiles[f].draw();
	}
	if (mode === MENU) {
		ctx.fillStyle = "rgba(0, 0, 0, .6)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
	ctx.restore();
}

function restart() {
	grid.grid = blankGrid();
	$("table").remove();
	snake.revive();
	powers = {
		explo: 0,
		slice: 0
	}
	balls = [Object.create(Ball)];
	if (mode === TRIBALL) {
		for (var i = 0; i < 2; ++i) {
			balls.push(Object.create(Ball));
		}
	}
	powerUps = [];
	score = 0;
}

function makeMenu() {
	removeMenu();
	balls = [];
	for (var i = 0; i < 3; ++i) {
		balls.push(Object.create(Ball));
	}
	
	mode = MENU;
	$("#main").append("<div id='logo'></div>");
	for (var i = 0; i < 4; ++i) {
		var m = ["ARCADE", "TRIBALL", "PRO", "TACTIC"][i];
		var b = $("<button id='" + m.toLowerCase() + "' class='mode-select nav-button' onclick='startGame(" + m + ")'>" + (m[0]+m.substr(1).toLowerCase()) + "</button>");
		if (i > 0) {
			b.css("left", (10 + 27.5 * (i - 1)) + "%").
			  css("top", "62%");
		}
		else {
			b.css("width", "80%").
			  css("height", "25%").
			  css("left", "10%").
			  css("top", "35%");
		}
		$("#main").append(b);
	}
	$("#main").append($("<button id='score-button' class='nav-button' onclick='makeHighScores()'>High scores</button>"));
	$("#main").append($("<form><input oninput='rename()' placeholder='Select name' id='name-input' type='text'></input></form>"));
	$("#main").append("<button id='mute' onclick='mute()'>🔊</button>");
}

function rename() {
	ajax.rename($("#name-input").val());
}

function makeHighScores() {
	ajax.fetchScores().then(function() {
		removeMenu();
		var left = 30;
		$("#main").append("<div id='score-title'>High Scores</div>");
		for (var mode of [ARCADE, TRIBALL, PRO, TACTIC]) {
			var table = makeScoreTable(mode);		
			table.css("left", left);
			left += 120;
			$("#main").append(table);
		}
		$("#main").append($("<button id='score-back' class='nav-button' onclick='makeMenu()'>Back</button>"));
	});
}

function makeScoreTable(mode) {
	let modeHighscores = highScores.filter(a => a[2] === mode);
	let selfScore = false;
	let table = $("<table id='" + mode.toLowerCase() + "-table' class='score-table'><tr><th colspan=3>" + mode + "</th></td>");
	for (var r = 0; r < Math.min(10, modeHighscores.length); ++r) {
		let tr = $(
		"<tr class='score-row" + (userName === modeHighscores[r][0] ? " own-score'" : "") + "'>" + 
			"<td class='score-rank'>" + (1 + r) + "</td>" + 
			"<td class='score-name'><div class='score-name-inner'>" + modeHighscores[r][0] + "</div></td>" + 
			"<td class='score-score'>" + modeHighscores[r][1] + "</td>" + 
		"</tr>");
		table.append(tr);
		if (userName === modeHighscores[r][0]) {
			selfScore = true;
		}
	}
	if (!selfScore) {
		var myScore = modeHighscores.filter(a => a[0] === userName)[0];
		if (myScore) {
			table.append($("<tr><th colspan=3>&#x22ee;</th></td>"));
			let tr = $(
			"<tr class='score-row' class='own-score'>" + 
				"<td class='score-rank'>" + (modeHighScores.indexOf(myScore[0]) + 1) + "</td>" + 
				"<td class='score-name'>" + myScore[0] + "</td>" + 
				"<td class='score-score'>" + myScore[1] + "</td>" + 
			"</tr>");
			table.append(tr);
		}
	}
	return table;
}

function mute() {
	muted = !muted;
	$("#mute").html(muted ? "🔇" : "🔊");
}

function removeMenu() {
	$(".mode-select, #logo, #score-button, table, #score-title, #score-back, #name-input").remove();
}

function startGame(m) {
	mode = m;
	console.log(m);
	removeMenu();
	restart();
}



onload = main;