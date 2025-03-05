import {ChangeDetectorRef, Component, inject, input, viewChild} from "@angular/core";
import {TableComponent} from "@utility/table.component";
import {ITableState} from "@utility/domain/table.state";
import {Store} from "@ngxs/store";
import {NGXLogger} from "ngx-logger";
import {Reactive} from "@utility/cdk/reactive";
import {ABaseEntity} from "@core/system/abstract/a.base-entity";

@Component({
	selector: 'utility-layout-list-component',
	template: ``
})
export default abstract class LayoutListComponent<ITEM extends ABaseEntity> extends Reactive {

	public readonly tableComponent = viewChild.required(TableComponent);

	public readonly tableState = input.required<ITableState<ITEM> | null>();

	public readonly isPage = input(true);

	protected readonly store = inject(Store);
	protected readonly changeDetectorRef = inject(ChangeDetectorRef);
	protected readonly ngxLogger = inject(NGXLogger);

}

