import {inject, Injectable} from "@angular/core";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {BaseActions} from "@utility/state/base/base.actions";
import {TableState} from "@utility/domain/table.state";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngxs/store";

@Injectable()
export class TableService<ITEM> {

	readonly #store = inject(Store);

	public readonly actions!: {
		readonly GetList: typeof BaseActions.GetList;
		readonly UpdateTableState: typeof BaseActions.UpdateTableState<ITEM>;
	};
	public readonly showAction = new BooleanStreamState(true);
	public readonly showSelectedStatus = new BooleanStreamState(false);

	public tableState: TableState<ITEM> = new TableState<ITEM>();

	public pageChange($event: number) {
		firstValueFrom(this.#store.dispatch(new this.actions.UpdateTableState({
			page: $event
		}))).then(() => {
			this.#store.dispatch(new this.actions.GetList());
		});
	}
}
