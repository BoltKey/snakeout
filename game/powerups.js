const PowerUp = {
	x: 0,
	y: 0,
	life: 0,
	maxLife: 500,
	type: "none",
	inited: false,
	update: function() {
		if (!this.inited) {
			do {
				this.x = Math.floor(Math.random() * (maxx - 1));
				this.y = Math.floor(Math.random() * (maxy - 1));
			} while (((Math.abs(this.x - snake.x) + Math.abs(this.y - snake.y)) < 5) || grid.grid[this.y][this.x]);
			this.inited = true;
		}
		++this.life;
	},
	pick: function() {
		this.life = 100000;
		if (this.effect) {
			this.effect();
		}
	},
	draw: function() {
		ctx.fillStyle = this.color;
		ctx.translate((this.x + .5) * tilew, (this.y + .5) * tilew);
		let effect = Math.min(1, this.life / this.maxLife * 10);
		
		ctx.globalAlpha = Math.min(1, (this.maxLife - this.life) / 20);
		Ball.draw(0, 0, tilew * .4 * effect, this.type);
		
		ctx.beginPath();
		ctx.arc(0, 0, tilew * .7, Math.PI * .5, Math.PI * 2.5 - Math.PI * 2 * this.life / this.maxLife);
		ctx.strokeStyle = "white";
		ctx.globalAlpha = effect;
		ctx.lineWidth = tilew * .2;
		ctx.stroke();
		ctx.globalAlpha = 1;
		ctx.translate(- (this.x + .5) * tilew, - (this.y + .5) * tilew);
		
	}
}

ExplosiveBall = Object.create(PowerUp);
ExplosiveBall.effect = function() {
	powers.explo = maxPowers.explo;
}
ExplosiveBall.type = "explo";
/*ExplosiveBall.draw = function() {
	ctx.fillStyle = "red";
	ctx.translate((this.x + .5) * tilew, (this.y + .5) * tilew);
	Ball.draw(0, 0, tilew * .4 * (Math.min(1, this.life / this.maxLife * 10)), "explo");
	ctx.translate(- (this.x + .5) * tilew, - (this.y + .5) * tilew);
}*/

SliceBall = Object.create(PowerUp);
SliceBall.effect = function() {
	powers.slice = maxPowers.slice;
}
SliceBall.type = "slice";
/*SliceBall.draw = function() {
	ctx.fillStyle = "blue";
	ctx.translate((this.x + .5) * tilew, (this.y + .5) * tilew);
	Ball.draw(0, 0, tilew * .4 * (Math.min(1, this.life / this.maxLife * 10)), "slice");
	ctx.translate(- (this.x + .5) * tilew, - (this.y + .5) * tilew);
}*/

ExtraBall = Object.create(PowerUp);
ExtraBall.effect = function() {
	balls.push(Object.create(Ball));
}
ExtraBall.type = "none";
/*ExtraBall.draw = function() {
	ctx.fillStyle = "yellow";
	ctx.translate((this.x + .5) * tilew, (this.y + .5) * tilew);
	Ball.draw(0, 0, tilew * .4 * (Math.min(1, this.life / this.maxLife * 10)), "none");
	ctx.translate(- (this.x + .5) * tilew, - (this.y + .5) * tilew);
}*/

const PowerUps = [ExplosiveBall, SliceBall, ExtraBall];