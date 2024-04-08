import {Component, inject} from "@angular/core";
import {IEvent} from "@event/domain";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngxs/store";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {EventStatusEnum} from "@src/module/utility/domain/enum/event-status.enum";
import {ChangeStatusBaseComponent} from "@event/presentation/component/change-status/change-status-base.component";
import {EventRequestedActions} from "@event/state/event-requested/event-requested.actions";
import {RefreshCalendarAction} from "@event/state/calendar/actions/refresh.calendar.action";
import {CalendarWithSpecialistsAction} from "@event/state/calendar-with-specialists/calendar-with-specialists.action";

@Component({
	selector: 'event-change-status-on-rejected-component',
	standalone: true,
	imports: [
		DynamicDatePipe,
		TranslateModule,
		RouterLink,
		EditLinkComponent,
		NgIf,
		NgTemplateOutlet
	],
	template: `
		<button
			type="button"
			(click)="changeStatusOnRejected(event)"
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
			<i class="bi bi-x-lg"></i>
			{{ 'keyword.capitalize.reject' | translate }}
		</button>
	`
})
export class ChangeStatusOnRejectedComponent extends ChangeStatusBaseComponent {

	public readonly store = inject(Store);

	public async changeStatusOnRejected(event: IEvent): Promise<void> {
		await firstValueFrom(this.store.dispatch(new EventRequestedActions.RejectedStatus(event)));
		this.postStatusChange(EventStatusEnum.rejected);
		this.store.dispatch(new EventRequestedActions.GetList({resetPage: false, resetParams: false}));
		this.store.dispatch(new CalendarWithSpecialistsAction.GetItems());
		this.store.dispatch(new RefreshCalendarAction());
	}


}
