import {Component, inject} from "@angular/core";
import {IEvent} from "@event/domain";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {EventActions} from "@event/state/event/event.actions";
import {Store} from "@ngxs/store";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {EventStatusEnum} from "@src/module/utility/domain/enum/event-status.enum";
import {ChangeStatusBaseComponent} from "@event/presentation/component/change-status/change-status-base.component";
import {RefreshCalendarAction} from "@event/state/calendar/actions/refresh.calendar.action";
import {FilterService} from "@event/presentation/page/calendar-with-specialists/component/filter/filter.service";

@Component({
	selector: 'event-change-status-on-cancelled-component',
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
			(click)="changeStatusOnCancelled(event)"
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
			{{ 'keyword.capitalize.cancel' | translate }}
		</button>
	`
})
export class ChangeStatusOnCancelledComponent extends ChangeStatusBaseComponent {

	public readonly store = inject(Store);
	public readonly filterService = inject(FilterService);

	public async changeStatusOnCancelled(event: IEvent): Promise<void> {
		await firstValueFrom(this.store.dispatch(new EventActions.CancelledStatus(event)));
		await firstValueFrom(this.store.dispatch(new EventActions.GetItem(event._id)));
		this.postStatusChange(EventStatusEnum.cancelled);
		this.store.dispatch(new EventActions.GetList({resetPage: false, resetParams: false}));
		this.store.dispatch(new RefreshCalendarAction());
		this.filterService.forceRefresh(); // Dashboard
	}

}
