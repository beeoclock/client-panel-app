import {Component, ViewEncapsulation} from "@angular/core";
import LayoutListComponent from "@utility/layout.list.component";
import {TableListComponent} from "@service/presentation/component/list/table/table.list.component";
import {FilterComponent} from "@service/presentation/component/filter/filter.component";

@Component({
	selector: 'service-desktop-layout-list-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<service-filter-component (filters)="filters.emit($event)"/>
		<service-table-list-component class="flex flex-1 flex-col h-px"/>

	`,
	imports: [
		TableListComponent,
		FilterComponent
	],
})
export class DesktopLayoutListComponent extends LayoutListComponent {
}
