import {BaseItem} from "@signaldb/core";
import {IBaseEntity} from "@utility/domain";

type Base<OBJECT_TYPE extends string> = IBaseEntity<OBJECT_TYPE> & BaseItem<string>;

export interface IBaseItem<OBJECT_TYPE extends string, DTO> extends Base<OBJECT_TYPE> {

	id: string;

	toDTO(): DTO;

}

export default IBaseItem;
