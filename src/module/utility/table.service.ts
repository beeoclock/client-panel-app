import {Injectable} from "@angular/core";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {BaseActions} from "@utility/state/base/base.actions";

@Injectable()
export class TableService<ITEM> {

	public readonly actions!: {
		readonly GetList: typeof BaseActions.GetList;
		readonly UpdateTableState: typeof BaseActions.UpdateTableState<ITEM>;
	};
	public readonly showAction = new BooleanStreamState(true);
	public readonly showSelectedStatus = new BooleanStreamState(false);

}
