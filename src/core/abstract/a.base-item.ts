import {IBaseItem} from "@src/core/interface/i.base-item";
import {Types} from "@utility/types";

/**
 * Base class for all items.
 * How to use: class Item extends ABaseItem<IItem> implements IItem {} and class Item should
 *
 * @template T - type of item data.
 */
export abstract class ABaseItem<T extends string> implements IBaseItem<T> {

	id!: string;

	_id!: string & Types.ObjectId;
	createdAt!: string & Types.DateTime;
	object!: T;
	updatedAt!: string & Types.DateTime;

	public constructor(data: { _id: string & Types.ObjectId }) {
		this.id = data._id;
		Object.assign(this, data);
	}

	public toDTO(): never {
		throw new Error('Method not implemented.');
	}

}
