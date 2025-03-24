import {Component, ViewEncapsulation} from "@angular/core";
import {TableListComponent} from "@absence/presentation/ui/component/list/table/table.list.component";
import {FilterComponent} from "@absence/presentation/ui/component/filter/filter.component";
import LayoutListComponent from "@utility/layout.list.component";

@Component({
	selector: 'absence-desktop-layout-list-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<app-absence-filter-component/>
		<app-list-absence-table class="flex flex-1 flex-col h-px"/>
	`,
	imports: [
		TableListComponent,
		FilterComponent
	],
})
export class DesktopLayoutListComponent extends LayoutListComponent {
}
