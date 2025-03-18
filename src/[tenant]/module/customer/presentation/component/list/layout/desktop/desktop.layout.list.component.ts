import {Component, ViewEncapsulation} from "@angular/core";
import {TableListComponent} from "@customer/presentation/component/list/table/table.list.component";
import {FilterComponent} from "@customer/presentation/component/filter/filter.component";
import LayoutListComponent from "@utility/layout.list.component";
import EService from "@core/business-logic/service/entity/e.service";

@Component({
	selector: 'customer-desktop-layout-list-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<customer-filter-component
			(filters)="filters.set($event)"/>

		<customer-table-list-component class="flex flex-1 flex-col h-px" [filters]="filters()"/>

	`,
	imports: [
		TableListComponent,
		FilterComponent
	],
})
export class DesktopLayoutListComponent extends LayoutListComponent<EService> {
}
