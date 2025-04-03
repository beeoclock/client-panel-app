import {Component, ViewEncapsulation} from "@angular/core";
import LayoutListComponent from "@shared/layout.list.component";
import {TableListComponent} from "@tenant/order-service/presentation/ui/organism/list/table/table.list.component";

@Component({
	selector: 'order-service-desktop-layout-list-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<!--		<payment-filter-component/>-->

		<order-service-table-list-component class="flex flex-1 flex-col"/>

	`,
	imports: [
		TableListComponent
	],
})
export class DesktopLayoutListComponent extends LayoutListComponent {
}
