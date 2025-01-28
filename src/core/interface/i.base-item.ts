import {BaseItem} from "@signaldb/core";
import {IBaseEntity} from "@utility/domain";

export interface IBaseItem<T extends IBaseEntity<string>> extends BaseItem<string> {

	raw: T;

}
