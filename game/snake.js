
const Snake = {
	
	x: Math.floor(Math.random() * maxx),
	y: Math.floor(Math.random() * maxy),
	dirQueue: [],
	path: [[this.x, this.y]],
	dir: 0,
	cooldown: 15,
	lastMove: 0,
	ded: false,
	move: function() {
		if (this.dirQueue.length > 0) {
			this.dir = this.dirQueue.splice(0, 1)[0];
		}
		switch(this.dir) {
			case 0: --this.x; break;
			case 1: --this.y; break;
			case 2: ++this.x; break;
			case 3: ++this.y; break;
		}
		if (this.x < 0)
			this.x += maxx;
		if (this.y < 0) 
			this.y += maxy;
		this.x %= maxx;
		this.y %= maxy;
		
		this.path.push([this.x, this.y]);
	},
	update: function() {
		if (mode === MENU) {
			if (Math.random() < 0.05)
				grid.grid[Math.floor(Math.random() * maxy)][Math.floor(Math.random() * maxx)] = 1
		}
		else {
			this.cooldown = {
				ARCADE: Math.floor(2500/(score + 180)),
				PRO: 5,
				TRIBALL: 10,
				TACTIC: 16
			}[mode];
			if (++this.lastMove >= this.cooldown && !this.ded) {
				this.move();
				if (grid.grid[this.y][this.x]) {
					grid.grid[this.y][this.x] = 2;
					this.die();
					return;
				}
				grid.grid[this.y][this.x] = 1;
				this.lastMove = 0;
			}
		}
	},
	die: function() {
		if (mode !== MENU) {
			this.ded = true;
			$("#main").append(makeScoreTable(mode));
			if (!muted) {
				audio.ded.play();
			}
		}
	},
	revive: function() {
		this.lastMove = 0;
		this.ded = false;
		this.path = [[this.x, this.y]];
		this.dirQueue = [];
	}
}