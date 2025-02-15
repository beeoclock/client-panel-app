import {Component, inject} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngxs/store";
import {ChangeStatusBaseComponent} from "@event/presentation/component/change-status/change-status-base.component";
import {
	CalendarWithSpecialistsAction
} from "@event/infrastructure/state/calendar-with-specialists/calendar-with-specialists.action";
import {OrderServiceStatusEnum} from "../../../../../../core/business-logic/order/enum/order-service.status.enum";
import {EventActions} from "@event/infrastructure/state/event/event.actions";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";

@Component({
	selector: 'event-change-status-on-cancelled-component',
	standalone: true,
	imports: [
		TranslateModule,
		LoaderComponent
	],
	template: `
		<button
			type="button"
			[disabled]="loading.isTrue"
			(click)="changeStatusOnCancelled()"
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
				text-red-700
				bg-red-50
				shadow-sm
				ring-1
				ring-inset
				ring-red-300
				hover:bg-red-100">
			@if (loading.isFalse) {
				<i class="bi bi-x-lg"></i>
				{{ 'keyword.capitalize.cancel' | translate }}
			} @else {
				<utility-loader [py2_5]="false" />
			}

		</button>
	`
})
export class ChangeStatusOnCancelledComponent extends ChangeStatusBaseComponent {

	public readonly store = inject(Store);

	public async changeStatusOnCancelled(): Promise<void> {
		this.loading.doTrue();
		const event = this.event();
  event.originalData.service.status = OrderServiceStatusEnum.cancelled;
		await firstValueFrom(
			this.store.dispatch(
				new EventActions.ChangeServiceStatus({
					orderId: event.originalData.order._id,
					serviceId: event.originalData.service._id,
					status: OrderServiceStatusEnum.cancelled,
				})
			)
		);
		this.store.dispatch(new CalendarWithSpecialistsAction.GetItems());
		this.store.dispatch(new EventActions.UpdateOpenedDetails(event));
		this.statusChange.emit();
		this.loading.doFalse();
	}


}
