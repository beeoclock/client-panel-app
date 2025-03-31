import {Component, ViewEncapsulation} from "@angular/core";
import LayoutListComponent from "@shared/layout.list.component";
import {TableListComponent} from "@tenant/service/presentation/ui/component/list/table/table.list.component";
import {FilterComponent} from "@tenant/service/presentation/ui/component/filter/filter.component";

@Component({
	selector: 'service-desktop-layout-list-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<service-filter-component />
		<service-table-list-component class="flex flex-1 flex-col h-px"/>

	`,
	imports: [
		TableListComponent,
		FilterComponent
	],
})
export class DesktopLayoutListComponent extends LayoutListComponent {
}
