import {IBaseItem} from "@src/core/interface/i.base-item";
import {IBaseEntity} from "@utility/domain";

/**
 * Base class for all items.
 * How to use: class Item extends ABaseItem<IItem> implements IItem {} and class Item should
 *
 * @template T - type of item data.
 */
export abstract class ABaseItem<T extends IBaseEntity<string>> implements IBaseItem<T> {

	id!: string;
	raw!: T;

	protected constructor(raw: T) {
		this.id = raw._id;
		this.raw = raw;
	}

	public toDTO(): T {
		return this.raw;
	}

}
