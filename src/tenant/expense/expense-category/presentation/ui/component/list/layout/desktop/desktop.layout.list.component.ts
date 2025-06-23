import {Component, ViewEncapsulation} from "@angular/core";
import LayoutListComponent from "@shared/layout.list.component";
import {FilterComponent} from "@tenant/expense/expense-category/presentation/ui/component/filter/filter.component";
import {
	TableListComponent
} from "@tenant/expense/expense-category/presentation/ui/component/list/table/table.list.component";

@Component({
	selector: 'expense-category-desktop-layout-list-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<expense-category-filter-component/>
		<expense-category-table-list-component class="flex flex-1 flex-col"/>
	`,
	imports: [
		FilterComponent,
		TableListComponent
	],
})
export class DesktopLayoutListComponent extends LayoutListComponent {
}
