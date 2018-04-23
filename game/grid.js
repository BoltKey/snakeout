const maxx = 25;
const maxy = 20;
const tilew = 20;
let grid = {
	grid: blankGrid(),
	draw: function() {
		let gridColor = "#333333"
		ctx.beginPath();
		ctx.strokeStyle = gridColor;
		ctx.lineWidth = tilew - 1;
		ctx.moveTo(...snake.path[0].map(a => (a + .5) * tilew));
		for (let p = 1; p < snake.path.length; ++p) {
			ctx.lineTo(...snake.path[p].map(a => (a + .5)*tilew));
			if (snake.path[p + 1] && (Math.abs(snake.path[p+1][0] - snake.path[p][0]) + Math.abs(snake.path[p+1][1] - snake.path[p][1]) > 5)) {
				// wrap around
				//ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(...snake.path[p+1].map(a => (a+.5)*tilew));
				++p;
			}
		}
		
		//ctx.stroke();
		for (let i in this.grid) {
			for (let j in this.grid[i]) {
				ctx.translate((.5 + +j) * tilew, (.5 + +i) * tilew);
				if (this.grid[i][j] === 2) {
					ctx.fillStyle = "red";
					ctx.fillRect(-tilew * .5 + 1, -tilew * .5 + 1, tilew - 2, tilew - 2);
				}
				else if (this.grid[i][j]) {
					drawBlock();
				}
				else {
					ctx.fillStyle = gridColor;
					ctx.fillRect(-tilew * .5 + 1, -tilew * .5 + 1, tilew - 2, tilew - 2);
				}
				ctx.translate((-j - .5) * tilew, (-i - .5) * tilew);
			}
		}
		
	}
}

function blankGrid() {
	let g = [];
	for (let i = 0; i < maxy; ++i) {
		let row = [];
		for (let j = 0; j < maxx; ++j) {
			row.push(0);
		}
		g.push(row);
	}
	return g;
}

function drawBlock() {
	let whiteGrad = ctx.createLinearGradient(0, 0, tilew, tilew);
	whiteGrad.addColorStop(0, "#ffffff");
	whiteGrad.addColorStop(1, "#bbbbbb");
	ctx.fillStyle = whiteGrad;
	ctx.fillRect(-tilew * .5 + 1, -tilew * .5 + 1, tilew - 2, tilew - 2);
}