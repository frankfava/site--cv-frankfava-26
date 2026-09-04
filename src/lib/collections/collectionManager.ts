type SortableValue = string | number | Date | null | undefined;

export class CollectionManager<TId extends string, TData extends Record<string, unknown>, TEntry extends { id: TId; data: TData }, TSanitised = { id: TId } & TData> {
	protected list: TEntry[] = [];

	constructor(entries: TEntry[]) {
		this.setData(entries);
	}

	setData(entries: TEntry[]): this {
		this.list = entries;
		return this;
	}

	_get(): TEntry[] {
		return this.list;
	}

	sort(key: keyof TData, ascending: boolean = false): this {
		this.list = this.list.sort((a, b) => this.compareValues(a.data[key] as SortableValue, b.data[key] as SortableValue, ascending));
		return this;
	}

	filter(predicate: (item: TEntry) => boolean): this {
		this.list = this.list.filter(predicate) as TEntry[];
		return this;
	}

	map(callback: (item: TEntry) => unknown): this {
		this.list = this.list.map(callback) as TEntry[];
		return this;
	}

	_restructure(): TSanitised[] {
		return this.list.map((item) => this.restructureItem(item));
	}

	/** Branch a chain on a condition. Every operation mutates, so the chain continues either way. */
	when(condition: unknown, callback: (manager: this) => unknown, fallback: (manager: this) => unknown = () => undefined): this {
		if (condition) {
			callback(this);
		} else {
			fallback(this);
		}
		return this;
	}

	_getKeys(): TId[] {
		return this.list.map((item) => item.id);
	}

	_getById(id: TId): TEntry | undefined {
		return this.list.find((item) => item.id === id);
	}

	protected restructureItem(item: TEntry): TSanitised {
		return { id: item.id, ...item.data } as unknown as TSanitised;
	}

	protected compareValues(aValue: SortableValue, bValue: SortableValue, ascending: boolean): number {
		if (typeof aValue === "string" && typeof bValue === "string") {
			return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
		}

		const aNumber = aValue instanceof Date ? aValue.getTime() : Number(aValue ?? 0);
		const bNumber = bValue instanceof Date ? bValue.getTime() : Number(bValue ?? 0);
		if (aNumber === bNumber) return 0;
		return ascending ? (aNumber < bNumber ? -1 : 1) : aNumber < bNumber ? 1 : -1;
	}
}
