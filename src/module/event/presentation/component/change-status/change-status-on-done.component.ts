import {Component, inject} from "@angular/core";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {Store} from "@ngxs/store";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {ChangeStatusBaseComponent} from "@event/presentation/component/change-status/change-status-base.component";
import {CalendarWithSpecialistsAction} from "@event/state/calendar-with-specialists/calendar-with-specialists.action";
import {EventActions} from "@event/state/event/event.actions";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import {firstValueFrom} from "rxjs";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";

@Component({
	selector: 'event-change-status-on-done-component',
	standalone: true,
	imports: [
		DynamicDatePipe,
		TranslateModule,
		RouterLink,
		EditLinkComponent,
		NgIf,
		NgTemplateOutlet,
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

			<ng-container *ngIf="loading.isFalse">
				<i class="bi bi-check-lg"></i>
				{{ 'event.action.button.done.label' | translate }}
			</ng-container>
			<utility-loader [py2_5]="false" *ngIf="loading.isTrue"/>
		</button>
	`
})
export class ChangeStatusOnDoneComponent extends ChangeStatusBaseComponent {

	public readonly store = inject(Store);

	public async changeStatusOnDone(): Promise<void> {
		this.loading.doTrue();
		this.event.originalData.service.status = OrderServiceStatusEnum.done;
		const actionToChangeStatus$ = this.store.dispatch(new EventActions.ChangeServiceStatus({
			serviceId: this.event.originalData.service._id,
			orderId: this.event.originalData.order._id,
			status: OrderServiceStatusEnum.done,
		}));
		await firstValueFrom(actionToChangeStatus$);
		const actionToUpdateList$ =  this.store.dispatch(new CalendarWithSpecialistsAction.GetItems());
		await firstValueFrom(actionToUpdateList$);
		const actionToUpdateDetails$ = this.store.dispatch(new EventActions.UpdateOpenedDetails(this.event));
		await firstValueFrom(actionToUpdateDetails$);
		this.statusChange.emit();
		this.loading.doFalse();
	}

}
