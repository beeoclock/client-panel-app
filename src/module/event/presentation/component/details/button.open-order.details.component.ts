import {ChangeDetectionStrategy, Component, HostBinding, inject, input, ViewEncapsulation} from "@angular/core";
import {IOrder} from "@src/core/business-logic/order/interface/i.order";
import {Store} from "@ngxs/store";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";
import {TranslateModule} from "@ngx-translate/core";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";

@Component({
	standalone: true,
	selector: 'button-open-order-details',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		DynamicDatePipe,
	],
	template: `

		<div class="flex justify-between">
			<div>{{ 'sidebar.order' | translate }}</div>
			<div>{{ ('order.enum.status.singular.' + order().status) | translate }}</div>
		</div>
		<div class="flex justify-between">
			<div>{{ 'keyword.capitalize.services' | translate }}: {{ order().services.length }}</div>
			<div>{{ order().createdAt | dynamicDate }}</div>
		</div>

		<button (click)="openOrderDetails()" type="button" class="p-2 transition-all rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 flex justify-between">
			{{ 'order.keyword.singular.capitalize.openDetails' | translate }}
			<i class="bi bi-chevron-right"></i>
		</button>

	`
})
export class ButtonOpenOrderDetailsComponent {

	public readonly order = input.required<IOrder.DTO>();

	@HostBinding()
	public class = 'p-4 w-full flex flex-col gap-2 border-b bg-white';

	public readonly store = inject(Store);

	public openOrderDetails() {

		this.store.dispatch(new OrderActions.OpenDetails(this.order()));

	}

}
