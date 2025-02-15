import {BaseItem} from "@signaldb/core";
import {IBaseEntity} from "@utility/domain";
import {StateEnum} from "@core/shared/enum/state.enum";

type Base<OBJECT_TYPE extends string> = IBaseEntity<OBJECT_TYPE> & BaseItem<string>;

export interface IBaseItem<OBJECT_TYPE extends string, DTO> extends Base<OBJECT_TYPE> {

	id: string;

	changeState(state: StateEnum): void;
	toDTO(): DTO;

}

export default IBaseItem;
