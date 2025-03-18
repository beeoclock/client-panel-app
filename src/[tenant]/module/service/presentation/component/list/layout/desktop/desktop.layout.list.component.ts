import {Component, ViewEncapsulation} from "@angular/core";
import LayoutListComponent from "@utility/layout.list.component";
import EService from "@core/business-logic/service/entity/e.service";
import {TableListComponent} from "@service/presentation/component/list/table/table.list.component";
import {FilterComponent} from "@service/presentation/component/filter/filter.component";

@Component({
	selector: 'service-desktop-layout-list-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<service-filter-component
			(filters)="filters.set($event)"/>

		<service-table-list-component class="flex flex-1 flex-col h-px" [filters]="filters()"/>

	`,
	imports: [
		TableListComponent,
		FilterComponent
	],
})
export class DesktopLayoutListComponent extends LayoutListComponent<EService> {
}
