/**
 * Hero canvas: particles crossing from a customer side to a system side through
 * a single waist.
 */
export function particleField() {
	return {
		raf: 0,
		dots: [],
		w: 0,
		h: 0,

		init() {
			const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			const canvas = this.$refs.canvas;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			const size = () => {
				const r = canvas.getBoundingClientRect();
				const d = Math.min(window.devicePixelRatio || 1, 2);
				this.w = r.width;
				this.h = r.height;
				canvas.width = this.w * d;
				canvas.height = this.h * d;
				ctx.setTransform(d, 0, 0, d, 0, 0);
			};

			const seed = () => {
				this.dots = [];
				const n = this.w < 680 ? 34 : 64;
				for (let i = 0; i < n; i++) {
					this.dots.push({
						p: Math.random(),
						y: Math.random(),
						speed: 0.00035 + Math.random() * 0.0007,
						opacity: 0.18 + Math.random() * 0.5,
						radius: 0.9 + Math.random() * 1.5,
						left: Math.random() < 0.5,
					});
				}
			};

			const paint = (step) => {
				ctx.clearRect(0, 0, this.w, this.h);
				for (const d of this.dots) {
					const t = d.p;
					const mid = this.h * 0.5;
					const ease = t < 0.5 ? t * 2 : (1 - t) * 2;
					const sx = d.left ? this.w * 0.06 : this.w * 0.94;
					const ex = d.left ? this.w * 0.94 : this.w * 0.06;
					const pxv = sx + (ex - sx) * t;
					const pyv = mid + (d.y - 0.5) * 2 * (this.h * 0.42 * (1 - ease * 0.88));
					ctx.beginPath();
					ctx.arc(pxv, pyv, d.radius * (1 + ease * 0.5), 0, 6.284);
					ctx.fillStyle = "rgba(" + (d.left ? "34,211,238" : "167,139,250") + "," + d.opacity * (0.35 + ease * 0.65) + ")";
					ctx.fill();
					if (!step) continue;
					d.p += d.speed;
					if (d.p > 1) {
						d.p = 0;
						d.y = Math.random();
						d.left = Math.random() < 0.5;
					}
				}
				const g = ctx.createLinearGradient(this.w * 0.5, this.h * 0.5 - 46, this.w * 0.5, this.h * 0.5 + 46);
				g.addColorStop(0, "rgba(255,255,255,0)");
				g.addColorStop(0.5, "rgba(255,255,255,.22)");
				g.addColorStop(1, "rgba(255,255,255,0)");
				ctx.fillStyle = g;
				ctx.fillRect(this.w * 0.5 - 0.6, this.h * 0.5 - 46, 1.2, 92);
			};

			const loop = () => {
				paint(true);
				this.raf = requestAnimationFrame(loop);
			};

			const start = () => {
				size();
				seed();
				cancelAnimationFrame(this.raf);
				if (reduce) paint(false);
				else loop();
			};

			window.addEventListener("resize", start);
			start();
		},
	};
}
