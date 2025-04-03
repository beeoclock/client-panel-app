import {Types} from "../../shared/types";
import {StateEnum} from "@core/shared/enum/state.enum";
import {IBaseDTO, IBaseEntityRaw} from "@core/shared/interface/i-base-entity.raw";
import ObjectID from "bson-objectid";

/**
 * Base class for all items.
 * How to use: class Item extends ABaseItem<IItem> implements IItem {} and class Item should
 *
 * @template T - type of item data.
 */
export abstract class ABaseEntity<
	OBJECT_TYPE = string,
	DTO extends IBaseDTO<OBJECT_TYPE> = IBaseDTO<OBJECT_TYPE>,
	RAW extends IBaseEntityRaw<OBJECT_TYPE> = IBaseEntityRaw<OBJECT_TYPE>
> implements IBaseEntityRaw<OBJECT_TYPE> {

	object!: OBJECT_TYPE;
	// From MongoDB/Backend
	_id: string & Types.ObjectId = new ObjectID().toHexString();
	createdAt: string & Types.DateTime = new Date().toISOString();
	updatedAt: string & Types.DateTime = new Date().toISOString();
	_version!: string;

	state!: StateEnum;
	stateHistory: {
		state: StateEnum;
		setAt: string & Types.DateTime
	}[] = [];

	syncedAt?: string & Types.DateTime;

	protected constructor(data: {
		_id: string & Types.ObjectId;
		stateHistory: { state: StateEnum; setAt: string & Types.DateTime }[]
	}) {
		this.initBeforeConstructor();
		const {stateHistory, ...rest} = data;
		Object.assign(this, rest);
		this.stateHistory = this.stateHistory.concat(stateHistory);
		this.initAfterConstructor()
	}

	public initBeforeConstructor(): void {
		// Use the function in child class to initialize the data before the constructor
	}

	public initAfterConstructor(): void {
		// Use the function in child class to initialize the data before the constructor
	}

	public changeState(state: StateEnum): void {
		this.state = state;
		this.stateHistory.push({state, setAt: new Date().toISOString()});
		this.refreshUpdatedAt();
	}

	public toDTO(): DTO {
		throw new Error('Method not implemented.');
	}

	public isNew(): boolean {
		return this.syncedAt === undefined;
	}

	public isUpdated(): boolean {
		return this.syncedAt !== undefined && this.updatedAt > this.syncedAt;
	}

	public initSyncedAt(force: string = new Date().toISOString()): void {
		this.syncedAt = force;
	}

	public refreshUpdatedAt(): void {
		/**
		 * Do not modify this line: `Date.now() + 1` is necessary for correct functionality with `syncedAt`.
		 * Example: If you remove `Date.now() + 1`, the following sequence will fail:
		 * entity.initSyncedAt(); entity.refreshUpdatedAt(); entity.isUpdated() will return false,
		 * because `updatedAt` will be the same as `syncedAt`.
		 */
		this.updatedAt = new Date(Date.now() + 1).toISOString();
	}

	public toRaw(): RAW {
		const {changeState, toDTO, isNew, isUpdated, initSyncedAt, refreshUpdatedAt, ...raw} = this;
		return raw as unknown as RAW;
	}

}
