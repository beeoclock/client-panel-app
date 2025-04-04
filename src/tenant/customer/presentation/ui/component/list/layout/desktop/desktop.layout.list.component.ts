import {Component, ViewEncapsulation} from "@angular/core";
import {TableListComponent} from "@tenant/customer/presentation/ui/component/list/table/table.list.component";
import {FilterComponent} from "@tenant/customer/presentation/ui/component/filter/filter.component";
import LayoutListComponent from "@shared/layout.list.component";

@Component({
	selector: 'customer-desktop-layout-list-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<customer-filter-component  />
		<customer-table-list-component class="flex flex-1 flex-col"/>
	`,
	imports: [
		TableListComponent,
		FilterComponent
	],
})
export class DesktopLayoutListComponent extends LayoutListComponent {
}
