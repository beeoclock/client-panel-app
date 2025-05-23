import {Component, ViewEncapsulation} from "@angular/core";
import {TableListComponent} from "@tenant/member/roles/presentation/component/list/table/table.list.component";
import {FilterComponent} from "@tenant/member/roles/presentation/component/filter/filter.component";
import LayoutListComponent from "@shared/layout.list.component";

@Component({
	selector: 'role-desktop-layout-list-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<member-filter-component/>

		<member-table-list-component class="flex flex-1 flex-col"/>

	`,
	imports: [
		TableListComponent,
		FilterComponent
	],
})
export class DesktopLayoutListComponent extends LayoutListComponent {
}
