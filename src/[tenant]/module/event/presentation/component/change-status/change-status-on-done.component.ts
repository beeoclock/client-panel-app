import {Component, inject} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {ChangeStatusBaseComponent} from "@event/presentation/component/change-status/change-status-base.component";
import {
	CalendarWithSpecialistsAction
} from "@event/infrastructure/state/calendar-with-specialists/calendar-with-specialists.action";
import {EventActions} from "@event/infrastructure/state/event/event.actions";
import {OrderServiceStatusEnum} from "@core/business-logic/order/enum/order-service.status.enum";
import {firstValueFrom} from "rxjs";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";

@Component({
	selector: 'event-change-status-on-done-component',
	standalone: true,
	imports: [
		TranslateModule,
		LoaderComponent
	],
	template: `
		<button
			(click)="this.changeStatusOnDone()"
			[disabled]="loading.isTrue"
			type="button"
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
		text-green-700
		bg-green-50
		shadow-sm
		ring-1
		ring-inset
		ring-green-300
		hover:bg-green-100
		cursor-pointer">

			@if (loading.isFalse) {

				<i class="bi bi-check-lg"></i>
				{{ 'event.action.button.done.label' | translate }}
			} @else {
				<utility-loader [py2_5]="false"/>
			}
		</button>
	`
})
export class ChangeStatusOnDoneComponent extends ChangeStatusBaseComponent {

	public readonly store = inject(Store);

	public async changeStatusOnDone(): Promise<void> {
		this.loading.doTrue();
		const event = this.event();
		event.originalData.service.status = OrderServiceStatusEnum.done;
		const actionToChangeStatus$ = this.store.dispatch(new EventActions.ChangeServiceStatus({
			serviceId: event.originalData.service._id,
			orderId: event.originalData.order._id,
			status: OrderServiceStatusEnum.done,
		}));
		await firstValueFrom(actionToChangeStatus$);
		const actionToUpdateList$ = this.store.dispatch(new CalendarWithSpecialistsAction.GetItems());
		await firstValueFrom(actionToUpdateList$);
		const actionToUpdateDetails$ = this.store.dispatch(new EventActions.UpdateOpenedDetails(event));
		await firstValueFrom(actionToUpdateDetails$);
		this.statusChange.emit();
		this.loading.doFalse();
	}

}
