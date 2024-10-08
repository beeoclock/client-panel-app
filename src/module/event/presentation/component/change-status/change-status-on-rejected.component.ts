import {Component, inject} from "@angular/core";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngxs/store";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {ChangeStatusBaseComponent} from "@event/presentation/component/change-status/change-status-base.component";
import {CalendarWithSpecialistsAction} from "@event/state/calendar-with-specialists/calendar-with-specialists.action";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import {EventActions} from "@event/state/event/event.actions";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";

@Component({
	selector: 'event-change-status-on-rejected-component',
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
			type="button"
			[disabled]="loading.isTrue"
			(click)="changeStatusOnRejected()"
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
			<ng-container *ngIf="loading.isFalse">
				<i class="bi bi-x-lg"></i>
				{{ 'keyword.capitalize.reject' | translate }}
			</ng-container>
			<utility-loader [py2_5]="false" *ngIf="loading.isTrue"/>
		</button>
	`
})
export class ChangeStatusOnRejectedComponent extends ChangeStatusBaseComponent {

	public readonly store = inject(Store);

	public async changeStatusOnRejected(): Promise<void> {
		this.loading.doTrue();
		this.event.originalData.service.status = OrderServiceStatusEnum.rejected;
		await firstValueFrom(this.store.dispatch(new EventActions.ChangeServiceStatus({
			orderId: this.event.originalData.order._id,
			serviceId: this.event.originalData.service._id,
			status: OrderServiceStatusEnum.rejected,
		})));
		this.store.dispatch(new CalendarWithSpecialistsAction.GetItems());
		this.store.dispatch(new EventActions.UpdateOpenedDetails(this.event));
		this.statusChange.emit();
		this.loading.doFalse();
	}


}
