import {ChangeDetectionStrategy, Component, input, OnInit, viewChildren} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {ListPage} from "@shared/list.page";
import {
	MobileLayoutListComponent
} from "@tenant/order/presentation/ui/component/list/layout/mobile/mobile.layout.list.component";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	OrderCustomerTableNgxDatatableSmartResource
} from "@tenant/order/presentation/ui/component/external/case/customer/list/order.customer.table-ngx-datatable.resource";
import {DatePipe} from "@angular/common";
import {
	CardItemOrderService
} from "@tenant/order/presentation/ui/component/list/card/item-lightweight/card.item.order.service";
import ECustomer from "@tenant/customer/domain/entity/e.customer";

@Component({
	selector: 'order-external-list-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		MobileLayoutListComponent,
	],
	standalone: true,
	providers: [
		CardItemOrderService,
		DatePipe,
		{
			provide: TableNgxDatatableSmartResource,
			useClass: OrderCustomerTableNgxDatatableSmartResource,
		},
	],
	styles: [
		`
			:host::ng-deep {
				--ion-background-color: theme('colors.neutral.100');
			}
		`
	],
	host: {
		class: 'bg-neutral-100'
	},
	template: `
		<app-order-mobile-layout-list-component
			[showButtonGoToForm]="false"
			[isPage]="false"
		/>
	`
})
export class CustomerOrderListExternalComponent extends ListPage implements OnInit {

	public readonly item = input.required<ECustomer>();

	readonly mobileLayoutListComponents = viewChildren(MobileLayoutListComponent);

	public override mobileMode = input(true);

	public override ngOnInit() {
		super.ngOnInit();
		this.tableNgxDatatableSmartResource?.filters.update((filters) => {
			return {
				...filters,
				customerId: this.item()._id,
			}
		})
	}

}

export default CustomerOrderListExternalComponent;
