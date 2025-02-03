import {IBaseItem} from "@src/core/interface/i.base-item";
import {Types} from "@utility/types";
import {StateEnum} from "@utility/domain/enum/state.enum";
import {ActiveEnum} from "@utility/domain/enum";

/**
 * Base class for all items.
 * How to use: class Item extends ABaseItem<IItem> implements IItem {} and class Item should
 *
 * @template T - type of item data.
 */
export abstract class ABaseItem<T extends string, DTO> implements IBaseItem<T, DTO> {

	// For IndexedDB
	id!: string;

	// From MongoDB/Backend
	_id!: string & Types.ObjectId;
	object!: T;
	createdAt!: string & Types.DateTime;
	updatedAt!: string & Types.DateTime;

	active!: ActiveEnum;
	state!: StateEnum;
	stateHistory!: {
		state: StateEnum;
		setAt: string & Types.DateTime
	}[];

	protected constructor(data: { _id: string & Types.ObjectId }) {
		this.id = data._id;
		Object.assign(this, data);
	}

	public toDTO(): DTO {
		throw new Error('Method not implemented.');
	}

}
