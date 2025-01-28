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

	protected constructor(data: IBaseItem<T>) {
		console.log('ABaseItem:constructor', {data});
		this.id = data._id;
		Object.assign(this, data);
	}

	public toDTO(): T {
		throw new Error('Method not implemented.');
	}

}
