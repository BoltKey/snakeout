const Ball = {
	x: 20,
	y: 20,
	a: 1,  // angle
	v: 3.33,  // velocity, pixels per frame
	r: 15,  // radius in pixels
	inited: false,
	lastBreak: false,
	update: function() {
		this.v = {
			ARCADE: 3.33,
			PRO: 3,
			TACTIC: 4,
			TRIBALL: 4,
			MENU: 2
		}[mode];
		if (!this.inited) {
			do {
				this.x = Math.random() * maxx * tilew;
				this.y = Math.random() * maxy * tilew;
			} while (distance(this.x, this.y, snake.x * tilew, snake.y * tilew) < 100);
			this.a = Math.random() * Math.PI * 2;
			this.inited = true;
		}
		if (!snake.ded || mode === MENU) {
			this.x += Math.cos(this.a) * this.v;
			this.y += Math.sin(this.a) * this.v;
			var mx = maxx * tilew;
			var my = maxy * tilew;
			if (this.x < 0)
				this.x = mx;
			if (this.y < 0)
				this.y = my;
			if (this.x > mx) {
				this.x = 0;
			}
			if (this.y > my) {
				this.y = 0;
			}
		}
		
		if (!this.lastBreak) {
			// prevent breaking two blocks in two frames right after each other, creating some unwanted behavior
			
			let adepts = this.squaresOverlapped();
			if (adepts.length > 1) {
				console.log(adepts);
				let adeptDiff = Math.abs(adepts[0][0] - adepts[1][0]) + Math.abs(adepts[0][1] - adepts[1][1]);
				if (adeptDiff > 1) {
					// special case: cornered (probably)
					if (powers.slice < 1) {
						this.a += Math.PI;
					}
					this.destroyBlock(...adepts[0]);
					this.destroyBlock(...adepts[1]);
					grid.grid[adepts[0][1]][adepts[0][0]] = 0;
					grid.grid[adepts[1][1]][adepts[1][0]] = 0;
					console.log("CORNER!");
					return;
				}
				else if (adeptDiff === 1) {
					// adepts are next to each other: keep only the closer one
					if (distance((adepts[0][0] + .5) * tilew, (adepts[0][1] + .5) * tilew, this.x, this.y)
						< 
						distance((adepts[1][0] + .5) * tilew, (adepts[1][1] + .5) * tilew, this.x, this.y)) {
						// first adept is closer
						adepts = [adepts[0]];
					}
					else {
						// second adept is closer
						adepts = [adepts[1]];
					}
				}
			}
			if (adepts[0]) {
				let a = adepts[0]
				
				this.destroyBlock(...a);
				
				let sx = (a[0] + .5) * tilew;
				let sy = (a[1] + .5) * tilew;
				let vertOver = Math.sign(Math.abs(sy - this.y) < tilew * .5 ? 0 : sy - this.y);
				let horzOver = Math.sign(Math.abs(sx - this.x) < tilew * .5 ? 0 : sx - this.x);
				let normal = 0;
				if (vertOver && horzOver) {
					// hit corner - special bounce
					let corner = [sx + horzOver * tilew * .5, sy + vertOver * tilew * .5];
					normal = -Math.atan((corner[1] - this.y)/(corner[0] - this.x));
					if (corner[0] - this.x > 0) {
						normal = Math.PI + normal;
					}
				}
				else if (horzOver) {
					normal = Math.PI * .5;
				}
				else if (vertOver) {
					normal = 0;
				}
				else {
					throw "Should not happen. Ball is not horzOver nor vertOver";
				}
				if (powers.slice < 1) {
					this.a = 2 * normal - this.a;
				}
				this.lastBreak = true;
			}
		}
		else {
			this.lastBreak = false;
		}
		
	},
	destroyBlock: function(x, y) {
		this.removeBlock(x, y);
		tileSound();
		if (powers.explo > 0) {
			explSound();
		}
		if (powers.explo > 0) {
			for (var i = -1; i <= 1; ++i) {
				for (var j = -1; j <= 1; ++j) {
					this.removeBlock(x + i, y + j);
				}
			}
		}
	},
	removeBlock(x, y) {
		if (grid.grid[y] && grid.grid[y][x]) {
			grid.grid[y][x] = 0;
			let sx = (x + .5) * tilew;
			let sy = (y + .5) * tilew;
			let fadeTile = Object.create(FadeTile);
			fadeTile.x = sx;
			fadeTile.y = sy;
			fadeTile.a = this.a;
			fadeTile.v = this.v * .1;
			fadeTiles.push(fadeTile);
			if (x === snake.x && y === snake.y) {
				snake.die();
				snake.x = Math.floor(Math.random() * maxx);
				snake.y = Math.floor(Math.random() * maxy);
				return;
			}
			++score;
			
		}
	},
	draw: function(x, y, r=this.r, power=undefined) {
		if (x === undefined && y === undefined) {
			for (let i = -1; i <= 1; ++i) {
				for (let j = -1; j <= 1; ++j) {
					this.draw(this.x + i * maxx * tilew, this.y + j * maxy * tilew,r,power);
				}
			}
		}
		else {
			for (var i = 0; i < 5; ++i) {	
				let c = 127 + 32*i;
				if (power === undefined) {
					power = "none";
					if (powers.slice > 0) {
						if (powers.explo > 0) {
							power = "combo";
						}
						else {
							power = "slice";
						}
					}
					else if (powers.explo > 0) {
						power = "explo";
					}
				}
					
				ctx.fillStyle = "rgb(" + 
					((power === "explo" || power === "combo" || power === "none") ? c : 0) + ", " + 
					(power === "none" ? c : 0) + ", " + 
					((power === "slice" || power === "combo") ? c : 0) + 
				")";
				ctx.beginPath();
				let off = i * r * .07;
				ctx.arc(x - off, y - off * .5, r * (1 - i * .11), 0, Math.PI * 2);
				ctx.fill();
				if (i === 0) {
					ctx.lineWidth = 2;
					ctx.strokeStyle = "black";
					ctx.stroke();
				}
			}
			
		}
		
	},
	squaresOverlapped: function() {
		let squares = [];
		let points = this.pointsOverlapped();
		for (let p of points) {
			for (let xm = -1; xm <= 0; ++xm) {
				for (let ym = -1; ym <= 0; ++ym) {
					let x = (p[0] + xm + maxx)%maxx;
					let y = (p[1] + ym + maxy)%maxy;
					if (grid.grid[y][x] && squares.every(a => !(a[0] === x && a[1] === y))) {
						squares.push([x, y]);
					}
				}
			}
		}
		return squares;
	},
	pointsOverlapped: function() {
		let points = [];
		let closestPoint = {x: Math.round(this.x / tilew), y: Math.round(this.y / tilew)};
		let bound = Math.ceil(this.r / tilew);
		for (let x = closestPoint.x - bound; x <= closestPoint.x + bound; ++x) {
			for (let y = closestPoint.y - bound; y <= closestPoint.y + bound; ++y) {
				if (distance(this.x, this.y, x * tilew, y * tilew) < this.r) {
					points.push([x, y]);
				}
			}			
		}
		return points;
	}
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}