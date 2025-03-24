import {Component, inject} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {ChangeStatusBaseComponent} from "@event/presentation/component/change-status/change-status-base.component";
import {EventActions} from "@event/presentation/state/event/event.actions";
import {OrderServiceStatusEnum} from "@core/business-logic/order/enum/order-service.status.enum";
import {
	CalendarWithSpecialistsAction
} from "@event/presentation/state/calendar-with-specialists/calendar-with-specialists.action";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";

@Component({
	selector: 'event-change-status-on-accepted-component',
	standalone: true,
	imports: [
		TranslateModule,
		LoaderComponent
	],
	template: `
		<button
			type="button"
			(click)="changeStatusOnAccepted()"
			[disabled]="loading.isTrue"
			class="
				w-full
				flex
				items-center
				justify-center
				gap-2
				rounded-2xl
				px-3
				py-2
				text-sm
				font-semibold
				text-blue-700
				bg-blue-50
				shadow-sm
				ring-1
				ring-inset
				ring-blue-300
				hover:bg-blue-100">
			@if (loading.isFalse) {

				<i class="bi bi-check-lg"></i>
				{{ 'keyword.capitalize.confirm' | translate }}
			} @else {
				<utility-loader [py2_5]="false"/>
			}
		</button>
	`
})
export class ChangeStatusOnAcceptedComponent extends ChangeStatusBaseComponent {

	public readonly store = inject(Store);

	public async changeStatusOnAccepted(): Promise<void> {

		this.loading.doTrue();
		const event = this.event();
		event.originalData.service.status = OrderServiceStatusEnum.accepted;

		this.store.dispatch(new EventActions.ChangeServiceStatus({
			serviceId: event.originalData.service._id,
			orderId: event.originalData.order._id,
			status: OrderServiceStatusEnum.accepted,
		}));
		this.store.dispatch(new CalendarWithSpecialistsAction.GetItems());
		this.store.dispatch(new EventActions.UpdateOpenedDetails(event));
		this.statusChange.emit();
		this.loading.doFalse();
	}


}
