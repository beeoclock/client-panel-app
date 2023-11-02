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

@Component({
	selector: 'event-change-status-on-booked-component',
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
			(click)="changeStatusOnBooked(event)"
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
			<i class="bi bi-check-lg"></i>
			{{ 'keyword.capitalize.approve' | translate }}
		</button>
	`
})
export class ChangeStatusOnBookedComponent extends ChangeStatusBaseComponent {

	public readonly store = inject(Store);

	public async changeStatusOnBooked(event: IEvent): Promise<void> {
		await firstValueFrom(this.store.dispatch(new EventActions.BookedStatus(event)));
		await firstValueFrom(this.store.dispatch(new EventActions.GetItem(event._id)));
		this.postStatusChange(EventStatusEnum.booked);
		this.store.dispatch(new EventActions.GetList({force: true, resetPage: false, resetParams: false}));
	}


}
