import {Component, inject} from "@angular/core";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {Store} from "@ngxs/store";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {ChangeStatusBaseComponent} from "@event/presentation/component/change-status/change-status-base.component";
import {EventActions} from "@event/state/event/event.actions";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import {CalendarWithSpecialistsAction} from "@event/state/calendar-with-specialists/calendar-with-specialists.action";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {IconComponent} from "@src/component/adapter/icon/icon.component";

@Component({
	selector: 'event-change-status-on-accepted-component',
	standalone: true,
	imports: [
		DynamicDatePipe,
		TranslateModule,
		RouterLink,
		EditLinkComponent,
		NgIf,
		NgTemplateOutlet,
		LoaderComponent,
		IconComponent
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
			<ng-container *ngIf="loading.isFalse">
				<app-icon name="bootstrapCheckLg"/>
				{{ 'keyword.capitalize.confirm' | translate }}
			</ng-container>
			<utility-loader [py2_5]="false" *ngIf="loading.isTrue"/>
		</button>
	`
})
export class ChangeStatusOnAcceptedComponent extends ChangeStatusBaseComponent {

	public readonly store = inject(Store);

	public async changeStatusOnAccepted(): Promise<void> {

		this.loading.doTrue();
		this.event.originalData.service.status = OrderServiceStatusEnum.accepted;

		this.store.dispatch(new EventActions.ChangeServiceStatus({
			serviceId: this.event.originalData.service._id,
			orderId: this.event.originalData.order._id,
			status: OrderServiceStatusEnum.accepted,
		}));
		this.store.dispatch(new CalendarWithSpecialistsAction.GetItems());
		this.store.dispatch(new EventActions.UpdateOpenedDetails(this.event));
		this.statusChange.emit();
		this.loading.doFalse();
	}


}
