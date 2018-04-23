let fadeTiles = [];

const FadeEffect = {
	x: 0,
	y: 0,
	a: 0,
	v: 0,
	rotation: 0,
	rotSpeed: 0,
	life: 0,
	maxLife: 50,
	inited: false,
	update: function() {
		if (!this.inited) {
			this.rotSpeed = (Math.random() - .5) * .06;
			this.maxLife = 30 + Math.random() * 40;
			this.inited = true;
		}
		++this.life;
		this.rotation += this.rotSpeed;
		this.x += Math.cos(this.a) * this.v;
		this.y += Math.sin(this.a) * this.v;
	}
}

const FadeTile = Object.create(FadeEffect);
FadeTile.draw = function() {
	ctx.translate(this.x, this.y);
	ctx.rotate(this.rotation);
	ctx.globalAlpha = 1 - this.life / this.maxLife;
	drawBlock();
	ctx.rotate(-this.rotation);
	ctx.translate(-this.x, -this.y);
	ctx.globalAlpha = 1;
}