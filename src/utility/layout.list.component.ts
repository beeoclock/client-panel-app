import {ChangeDetectorRef, Component, inject, input, signal} from "@angular/core";
import {ITableState} from "@utility/domain/table.state";
import {NGXLogger} from "ngx-logger";
import {Reactive} from "@utility/cdk/reactive";
import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {FiltersType} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";

@Component({
	selector: 'utility-layout-list-component',
	template: ``
})
export default abstract class LayoutListComponent<ITEM extends ABaseEntity> extends Reactive {

	public readonly tableState = input<ITableState<ITEM> | null>(null);

	public readonly isPage = input(true);

	public readonly filters = signal<FiltersType>({});

	protected readonly changeDetectorRef = inject(ChangeDetectorRef);
	protected readonly ngxLogger = inject(NGXLogger);

}

