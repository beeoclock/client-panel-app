import {Component, ViewEncapsulation} from "@angular/core";
import LayoutListComponent from "@shared/layout.list.component";
import {FilterComponent} from "@tenant/balance/presentation/ui/component/filter/filter.component";
import {TableListComponent} from "@tenant/balance/presentation/ui/component/list/table/table.list.component";

@Component({
	selector: 'balance-desktop-layout-list-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<balance-filter-component/>
		<balance-table-list-component class="flex flex-1 flex-col"/>
	`,
	imports: [
		FilterComponent,
		TableListComponent
	],
})
export class DesktopLayoutListComponent extends LayoutListComponent {
}
