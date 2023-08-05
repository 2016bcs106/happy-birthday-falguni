class Particle {

    constructor(ctx, radius, velocity, colorIndex) {
        this.ctx = ctx;
        this.radius = radius;
        this.velociy = velocity;
        this.isLaunched = false;
        this.trail = [];

        this.r = Math.floor(Math.random() * 225) + (colorIndex === 0 ? 35 : 0);
        this.g = Math.floor(Math.random() * 225) + (colorIndex === 1 ? 35 : 0);
        this.b = Math.floor(Math.random() * 225) + (colorIndex === 2 ? 35 : 0);
        this.a = 255;
    }

    draw(fireworkPosition, coordinates) {

        if (this.isLaunched) {
            this.a -= 1;
            this.velociy.y += 0.05;
            this.x += this.velociy.x;
            this.y += this.velociy.y;
        } else {
            this.x = fireworkPosition.x;
            this.y = fireworkPosition.y;
        }

        for (let coordinate of coordinates) {
            if (this.isLaunched && distance({ x: this.x, y: this.y }, coordinate) < 5) {
                coordinate.visible = true;
                coordinate.color = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
            }
        }

        this.trail.push({
            x: this.x,
            y: this.y,
            vx: (this.velociy.x > 0 ? Math.random() : -Math.random()) / 2,
            vy: 0,
            a: 25
        });

        if (this.trail.length >= 10) {
            this.trail.shift();
        }

        this.ctx.save();
        this.ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        // this.ctx.closePath();
        this.ctx.fill();

        for (let trail of this.trail) {
            this.ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${trail.a})`;
            trail.vy += 0.1;
            trail.x += trail.vx;
            trail.y += trail.vy;
            trail.a -= 0.1;
            this.ctx.beginPath();
            this.ctx.arc(trail.x, trail.y, Math.random(), 0, Math.PI * 2, false);
            // this.ctx.closePath();
            this.ctx.fill();
        }

        this.ctx.restore();
    }

}