import {Component, ViewEncapsulation} from "@angular/core";
import {TableListComponent} from "@absence/presentation/component/list/table/table.list.component";
import {FilterComponent} from "@absence/presentation/component/filter/filter.component";
import LayoutListComponent from "@utility/layout.list.component";
import EService from "@core/business-logic/service/entity/e.service";

@Component({
	selector: 'absence-desktop-layout-list-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<app-absence-filter-component
			(filters)="filters.set($event)"/>

		<app-list-absence-table class="flex flex-1 flex-col h-px" [filters]="filters()"/>

	`,
	imports: [
		TableListComponent,
		FilterComponent
	],
})
export class DesktopLayoutListComponent extends LayoutListComponent<EService> {
}
