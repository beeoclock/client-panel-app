import {Component, ViewEncapsulation} from "@angular/core";
import LayoutListComponent from "@shared/layout.list.component";
import {TableListComponent} from "@tenant/payment/presentation/ui/organism/list/table/table.list.component";
import {FilterComponent} from "@tenant/payment/presentation/ui/molecule/filter/filter.component";

@Component({
	selector: 'payment-desktop-layout-list-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<payment-filter-component/>
		<payment-table-list-component class="flex flex-1 flex-col"/>

    `,
	imports: [
		TableListComponent,
		FilterComponent
	],
})
export class DesktopLayoutListComponent extends LayoutListComponent {
}
