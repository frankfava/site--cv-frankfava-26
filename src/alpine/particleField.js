/** Particles crossing from a customer side to a system side through one waist. */

const NARROW = 680;

export function particleField() {
	return {
		ctx: null,
		raf: 0,
		dots: [],
		w: 0,
		h: 0,
		still: false,

		init() {
			this.ctx = this.$el.getContext("2d");
			if (!this.ctx) return;

			this.still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			this.measure();
			this.seed();

			// Positions are held as fractions, so a resize only has to re-measure.
			this.onResize = () => {
				this.measure();
				if (this.dots.length !== this.count) this.seed();
				if (this.still) this.paint(false);
			};
			window.addEventListener("resize", this.onResize);

			this.still ? this.paint(false) : this.loop();
		},

		destroy() {
			cancelAnimationFrame(this.raf);
			window.removeEventListener("resize", this.onResize);
		},

		get count() {
			return this.w < NARROW ? 34 : 64;
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

		seed() {
			this.dots = Array.from({ length: this.count }, () => ({
				p: Math.random(),
				y: Math.random(),
				speed: 0.00035 + Math.random() * 0.0007,
				opacity: 0.18 + Math.random() * 0.5,
				radius: 0.9 + Math.random() * 1.5,
				left: Math.random() < 0.5,
			}));
		},

		loop() {
			this.paint(true);
			this.raf = requestAnimationFrame(() => this.loop());
		},

		paint(advance) {
			const ctx = this.ctx;
			ctx.clearRect(0, 0, this.w, this.h);

			for (const dot of this.dots) {
				// Fullest at the waist, pinched at both ends.
				const ease = dot.p < 0.5 ? dot.p * 2 : (1 - dot.p) * 2;
				const from = dot.left ? this.w * 0.06 : this.w * 0.94;
				const to = dot.left ? this.w * 0.94 : this.w * 0.06;
				const x = from + (to - from) * dot.p;
				const y = this.h * 0.5 + (dot.y - 0.5) * 2 * (this.h * 0.42 * (1 - ease * 0.88));

				ctx.beginPath();
				ctx.arc(x, y, dot.radius * (1 + ease * 0.5), 0, 6.284);
				ctx.fillStyle = `rgba(${dot.left ? "34,211,238" : "167,139,250"},${dot.opacity * (0.35 + ease * 0.65)})`;
				ctx.fill();

				if (!advance) continue;
				dot.p += dot.speed;
				if (dot.p > 1) {
					dot.p = 0;
					dot.y = Math.random();
					dot.left = Math.random() < 0.5;
				}
			}

			this.paintWaist();
		},

		paintWaist() {
			const midX = this.w * 0.5;
			const midY = this.h * 0.5;
			const gradient = this.ctx.createLinearGradient(midX, midY - 46, midX, midY + 46);

			gradient.addColorStop(0, "rgba(255,255,255,0)");
			gradient.addColorStop(0.5, "rgba(255,255,255,.22)");
			gradient.addColorStop(1, "rgba(255,255,255,0)");

			this.ctx.fillStyle = gradient;
			this.ctx.fillRect(midX - 0.6, midY - 46, 1.2, 92);
		},
	};
}
