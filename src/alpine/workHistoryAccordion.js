export function workHistoryAccordion({ startOpen, count }) {
	return {
		startOpen,
		open: [...(startOpen ? Array.from({ length: count }, (_value, index) => index) : [])],
		isOpen(key) {
			return this.open.includes(key);
		},
		toggle(key) {
			if (this.isOpen(key)) {
				this.open = this.open.filter((f) => f !== key);
			} else {
				this.open.push(key);
			}
		},
	};
}
