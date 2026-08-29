/** A wireframe sphere turning slowly, its points on a fibonacci distribution. */

const COUNT = 900;
const TILT = 0.32;
const SPIN = 0.0022;

// The distribution is deterministic, so every instance draws the same one.
const POINTS = Array.from({ length: COUNT }, (_, i) => {
	const k = i + 0.5;
	const phi = Math.acos(1 - (2 * k) / COUNT);
	const theta = Math.PI * (1 + Math.sqrt(5)) * k;

	return [Math.cos(theta) * Math.sin(phi), Math.sin(theta) * Math.sin(phi), Math.cos(phi)];
});

export function orb() {
	return {
		ctx: null,
		raf: 0,
		w: 0,
		h: 0,
		turn: 0,
		still: false,

		init() {
			this.ctx = this.$el.getContext("2d");
			if (!this.ctx) return;

			this.still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			this.measure();

			this.onResize = () => {
				this.measure();
				if (this.still) this.paint();
			};
			window.addEventListener("resize", this.onResize);

			this.still ? this.paint() : this.loop();
		},

		destroy() {
			cancelAnimationFrame(this.raf);
			window.removeEventListener("resize", this.onResize);
		},

		measure() {
			const box = this.$el.getBoundingClientRect();
			const density = Math.min(window.devicePixelRatio || 1, 2);

			this.w = box.width;
			this.h = box.height;
			this.$el.width = this.w * density;
			this.$el.height = this.h * density;
			this.ctx.setTransform(density, 0, 0, density, 0, 0);
		},

		loop() {
			this.turn += SPIN;
			this.paint();
			this.raf = requestAnimationFrame(() => this.loop());
		},

		paint() {
			const ctx = this.ctx;
			const midX = this.w * 0.5;
			const midY = this.h * 0.5;
			const radius = Math.min(this.w, this.h) * 0.36;
			const cosTurn = Math.cos(this.turn);
			const sinTurn = Math.sin(this.turn);
			const cosTilt = Math.cos(TILT);
			const sinTilt = Math.sin(TILT);

			ctx.clearRect(0, 0, this.w, this.h);

			for (const [px, py, pz] of POINTS) {
				const x = px * cosTurn - pz * sinTurn;
				const spun = px * sinTurn + pz * cosTurn;
				const y = py * cosTilt - spun * sinTilt;
				const depth = (py * sinTilt + spun * cosTilt + 1) / 2;
				const scale = 0.55 + depth * 0.65;

				ctx.beginPath();
				ctx.arc(midX + x * radius * scale, midY + y * radius * scale, 0.75 + depth * 1.7, 0, 6.284);
				ctx.fillStyle = `rgba(${x > 0 ? "167,139,250" : "34,211,238"},${0.1 + depth * 0.72})`;
				ctx.fill();
			}

			this.paintHalo(midX, midY, radius);
		},

		paintHalo(midX, midY, radius) {
			const reach = radius * 1.5;
			const gradient = this.ctx.createRadialGradient(midX, midY, radius * 0.1, midX, midY, reach);

			gradient.addColorStop(0, "rgba(139,92,246,.20)");
			gradient.addColorStop(1, "rgba(139,92,246,0)");

			this.ctx.fillStyle = gradient;
			this.ctx.beginPath();
			this.ctx.arc(midX, midY, reach, 0, 6.284);
			this.ctx.fill();
		},
	};
}
