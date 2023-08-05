class Firework {

    constructor(ctx, width, height, target) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.isBlown = false;
        this.isDead = false;
        this.previousDistanceFromTarget = Infinity;

        this.position = {
            x: this.width / 2, y: this.height
        }

        this.target = target;

        this.ctx.beginPath();
        this.ctx.arc(this.target.x, this.target.y, 5, 0, Math.PI * 2, false);
        this.ctx.fill();
        this.ctx.closePath();

        let initialVelocity = Math.floor(Math.random() * 3) + 15;
        let angle = getAngle(this.target, this.position, initialVelocity)

        this.velocity = {
            x: initialVelocity * Math.cos(angle),
            y: initialVelocity * Math.sin(angle),
        }

        this.particles = this.createParticles();
    }

    draw(coordinates) {
        const distanceFromTarget = distance(this.position, this.target);

        this.velocity.y += 0.08;

        if (distanceFromTarget > 5 && this.previousDistanceFromTarget > distanceFromTarget) {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        } else {
            this.isBlown = true;
            this.particles.forEach(particle => {
                particle.isLaunched = true;
            })
        }

        this.isDead = true;

        this.particles.forEach(particle => {
            this.isDead = this.isDead && particle.a <= 0;
            particle.draw(this.position, coordinates);
        })

        this.previousDistanceFromTarget = distanceFromTarget;
    }


    createParticles() {
        const count = Math.floor(Math.random() * 25) + 50;

        const particles = [];

        let colorIndex = Math.floor(Math.random() * 3)

        for (let i = 0; i < count; i++) {
            const temp = Math.floor(Math.random() * 3) - 7;
            particles.push(new Particle(this.ctx, Math.random() * 5, {
                x: Math.floor(Math.random() * temp) - temp / 2,
                y: Math.floor(Math.random() * temp) - temp / 2
            }, colorIndex))
        }

        return particles;
    }

}