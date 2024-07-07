import {ChangeDetectorRef, Component, inject, Input, ViewChild} from "@angular/core";
import {TableComponent} from "@utility/table.component";
import {ITableState} from "@utility/domain/table.state";
import {IBaseEntity} from "@utility/domain";
import {Store} from "@ngxs/store";

@Component({
	selector: 'utility-layout-list-component',
	template: ``
})
export abstract class LayoutListComponent<ITEM extends IBaseEntity<string>> {

	@ViewChild(TableComponent)
	public tableComponent!: TableComponent<ITEM>;

	@Input({required: true})
	public tableState!: ITableState<ITEM> | null;

	@Input()
	public isPage = true;

	protected readonly store = inject(Store);
	protected readonly changeDetectorRef = inject(ChangeDetectorRef);

}

export default LayoutListComponent;
