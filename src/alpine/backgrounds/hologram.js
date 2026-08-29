/** A rotating wireframe globe, one node per role and per published project. */

const TILT = 0.4;
const SPIN = 0.0026;

/** Every literal below is in the 1040px units the mockup was authored in. */
const AUTHORED = 1040;
const LABEL_SIZE = 14;
const NODE_SIZE = { prominent: 6, plain: 6 };
const GLOW_SPREAD = 3;

const SEGMENTS = 96;

/** Alpha varies per node, which `--c-*` cannot carry as a hex string. */
function channelsOf(hex) {
	const value = hex.trim().replace("#", "");
	const full = value.length === 3 ? [...value].map((c) => c + c).join("") : value;
	const n = parseInt(full, 16);

	return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

export function hologram() {
	return {
		ctx: null,
		raf: 0,
		w: 0,
		h: 0,
		turn: 0,
		still: false,
		nodes: [],
		palette: {},
		mono: "monospace",

		init() {
			this.ctx = this.$el.getContext("2d");
			if (!this.ctx) return;

			this.scene = JSON.parse(this.$el.dataset.scene);
			this.seed();

			this.still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			this.readTheme();
			this.measure();

			this.onResize = () => {
				this.measure();
				if (this.still) this.paint();
			};
			window.addEventListener("resize", this.onResize);

			// Colour is authored per mode, so a palette read once goes stale on a flip.
			this.watchTheme = new MutationObserver(() => {
				this.readTheme();
				if (this.still) this.paint();
			});
			this.watchTheme.observe(document.documentElement, { attributeFilter: ["class"] });

			this.still ? this.paint() : this.loop();
		},

		destroy() {
			cancelAnimationFrame(this.raf);
			window.removeEventListener("resize", this.onResize);
			this.watchTheme.disconnect();
		},

		/** Dealt out along the spiral, or the labelled ones all land on one pole. */
		seed() {
			const count = this.scene.nodes.length;
			const labelled = this.scene.nodes.filter((node) => node.prominent);
			const rest = this.scene.nodes.filter((node) => !node.prominent);
			const order = [];

			labelled.forEach((node, i) => {
				order[Math.floor((i * count) / labelled.length)] = node;
			});
			for (let i = 0, next = 0; i < count; i++) if (!order[i]) order[i] = rest[next++];

			this.nodes = order.map((node, i) => {
				const y = 1 - (i / (count - 1)) * 1.86 - 0.07;
				const ring = Math.sqrt(Math.max(0, 1 - y * y));
				const theta = Math.PI * (3 - Math.sqrt(5)) * i;

				return { ...node, x: Math.cos(theta) * ring, y, z: Math.sin(theta) * ring };
			});
		},

		readTheme() {
			const style = getComputedStyle(this.$el);
			const tokens = new Set([this.scene.wireframe, this.scene.link, ...this.scene.nodes.map((node) => node.colour)]);

			this.palette = {};
			for (const token of tokens) this.palette[token] = channelsOf(style.getPropertyValue(`--c-${token}`));
			this.mono = style.getPropertyValue("--font-mono").trim() || "monospace";
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

		get unit() {
			return this.w / AUTHORED;
		},

		get radius() {
			return Math.min(this.w, this.h) * 0.36;
		},

		project(x, y, z) {
			const cosTurn = Math.cos(this.turn);
			const sinTurn = Math.sin(this.turn);
			const cosTilt = Math.cos(TILT);
			const sinTilt = Math.sin(TILT);

			const turnedX = x * cosTurn - z * sinTurn;
			const turnedZ = x * sinTurn + z * cosTurn;
			const tiltedY = y * cosTilt - turnedZ * sinTilt;
			const depth = y * sinTilt + turnedZ * cosTilt;
			const scale = (1 / (2.15 - depth * 0.62)) * 2.05;

			return { sx: this.w * 0.5 + turnedX * this.radius * scale, sy: this.h * 0.5 + tiltedY * this.radius * scale, z: depth, scale };
		},

		paint() {
			this.ctx.clearRect(0, 0, this.w, this.h);

			for (let i = -2; i <= 2; i++) this.paintRing("lat", i * 0.36, i === 0 ? 0.24 : 0.12);
			for (let i = 0; i < 6; i++) this.paintRing("lon", (i * Math.PI) / 6, 0.09);

			const points = this.nodes.map((node) => ({ ...this.project(node.x, node.y, node.z), node }));

			this.paintLinks(points);
			points.sort((a, b) => a.z - b.z).forEach((point) => this.paintNode(point));
		},

		paintRing(mode, offset, alpha) {
			const ctx = this.ctx;
			const latitude = Math.sqrt(Math.max(0, 1 - offset * offset));

			ctx.beginPath();
			for (let step = 0; step <= SEGMENTS; step++) {
				const theta = (step / SEGMENTS) * Math.PI * 2;
				const [x, y, z] =
					mode === "lat" ? [Math.cos(theta) * latitude, offset, Math.sin(theta) * latitude] : [Math.cos(theta) * Math.cos(offset), Math.sin(theta), Math.cos(theta) * Math.sin(offset)];
				const point = this.project(x, y, z);

				step ? ctx.lineTo(point.sx, point.sy) : ctx.moveTo(point.sx, point.sy);
			}

			ctx.strokeStyle = `rgba(${this.palette[this.scene.wireframe]},${alpha})`;
			ctx.lineWidth = 2 * this.unit;
			ctx.stroke();
		},

		paintLinks(points) {
			const ctx = this.ctx;
			const reach = this.radius * 1.15;

			ctx.lineWidth = 1.6 * this.unit;
			for (let i = 0; i < points.length; i++) {
				for (let j = i + 1; j < points.length; j++) {
					const from = points[i];
					const to = points[j];
					const gap = Math.hypot(from.sx - to.sx, from.sy - to.sy);
					if (gap >= reach) continue;

					const depth = (from.z + to.z) / 2;

					ctx.strokeStyle = `rgba(${this.palette[this.scene.link]},${0.22 * (1 - gap / reach) * (0.4 + depth * 0.6)})`;
					ctx.beginPath();
					ctx.moveTo(from.sx, from.sy);
					ctx.lineTo(to.sx, to.sy);
					ctx.stroke();
				}
			}
		},

		paintNode(point) {
			const ctx = this.ctx;
			const alpha = 0.32 + Math.max(0, point.z) * 0.68;
			const radius = (point.node.prominent ? NODE_SIZE.prominent : NODE_SIZE.plain) * this.unit * point.scale;
			const channels = this.palette[point.node.colour];
			const spread = radius * GLOW_SPREAD;
			const glow = ctx.createRadialGradient(point.sx, point.sy, 0, point.sx, point.sy, spread);

			glow.addColorStop(0, `rgba(${channels},${0.7 * alpha})`);
			glow.addColorStop(1, `rgba(${channels},0)`);
			ctx.fillStyle = glow;
			ctx.beginPath();
			ctx.arc(point.sx, point.sy, spread, 0, 6.284);
			ctx.fill();

			ctx.fillStyle = `rgba(${channels},${Math.min(1, alpha + 0.3)})`;
			ctx.beginPath();
			ctx.arc(point.sx, point.sy, radius, 0, 6.284);
			ctx.fill();

			if (point.node.prominent && point.z > -0.15) this.paintLabel(point, radius, alpha);
		},

		/** Text turns back towards the middle so an edge node keeps it on canvas. */
		paintLabel(point, radius, alpha) {
			const ctx = this.ctx;
			const outward = point.sx > this.w * 0.5;
			const offset = radius + 14 * this.unit;

			ctx.fillStyle = `rgba(${this.palette[point.node.colour]},${alpha * 0.9})`;
			ctx.font = `500 ${LABEL_SIZE * this.unit * point.scale}px ${this.mono}`;
			ctx.textAlign = outward ? "right" : "left";
			ctx.fillText(point.node.label, point.sx + (outward ? -offset : offset), point.sy + 9 * this.unit);
		},
	};
}
