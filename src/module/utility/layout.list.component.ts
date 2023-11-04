import {Component, Input, ViewChild} from "@angular/core";
import {TableComponent} from "@utility/table.component";
import {ITableState} from "@utility/domain/table.state";
import {BooleanState, RIBaseEntity} from "@utility/domain";

@Component({
	selector: 'utility-layout-list-component',
	template: ``
})
export abstract class LayoutListComponent<ITEM extends RIBaseEntity<string>> {

	@ViewChild(TableComponent)
	public tableComponent!: TableComponent<ITEM>;

	@Input({required: true})
	public tableState!: ITableState<ITEM> | null;

	@Input()
	public someDataExist = new BooleanState(false);

	@Input()
	public isPage = true;

}
