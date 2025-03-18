import {Component, ViewEncapsulation} from "@angular/core";
import {TableListComponent} from "@customer/presentation/component/list/table/table.list.component";
import {FilterComponent} from "@customer/presentation/component/filter/filter.component";
import LayoutListComponent from "@utility/layout.list.component";

@Component({
	selector: 'customer-desktop-layout-list-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<customer-filter-component  />
		<customer-table-list-component class="flex flex-1 flex-col h-px"/>
	`,
	imports: [
		TableListComponent,
		FilterComponent
	],
})
export class DesktopLayoutListComponent extends LayoutListComponent {
}
