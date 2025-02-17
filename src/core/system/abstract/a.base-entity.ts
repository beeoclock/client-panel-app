import {Types} from "../../shared/types";
import {StateEnum} from "@core/shared/enum/state.enum";
import {IBaseDTO, IBaseEntity} from "@core/shared/interface/i.base-entity";

/**
 * Base class for all items.
 * How to use: class Item extends ABaseItem<IItem> implements IItem {} and class Item should
 *
 * @template T - type of item data.
 */
export abstract class ABaseEntity<T extends string, DTO extends IBaseDTO> implements IBaseEntity<T, DTO> {

	// For IndexedDB
	id!: string;

	// From MongoDB/Backend
	_id!: string & Types.ObjectId;
	object!: T;
	createdAt: string & Types.DateTime = new Date().toISOString();
	updatedAt: string & Types.DateTime = new Date().toISOString();

	state!: StateEnum;
	stateHistory: {
		state: StateEnum;
		setAt: string & Types.DateTime
	}[] = [];

	protected constructor(data: {
		_id: string & Types.ObjectId;
		stateHistory: { state: StateEnum; setAt: string & Types.DateTime }[]
	}) {
		this.id = data._id;
		const {stateHistory, ...rest} = data;
		Object.assign(this, rest);
		this.stateHistory = this.stateHistory.concat(stateHistory);
	}

	public changeState(state: StateEnum): void {
		this.state = state;
		this.stateHistory.push({state, setAt: new Date().toISOString()});
	}

	public toDTO(): DTO {
		throw new Error('Method not implemented.');
	}

}
