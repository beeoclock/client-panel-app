import {Component, HostBinding, HostListener, inject} from "@angular/core";
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

@Component({
	selector: 'event-change-status-on-done-component',
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
		<i class="bi bi-check-lg"></i>
		{{ 'keyword.capitalize.done' | translate }}
	`
})
export class ChangeStatusOnDoneComponent extends ChangeStatusBaseComponent {

	public readonly store = inject(Store);

	@HostBinding()
	public class = `
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
	`;

	@HostListener('click')
	public onClick(): void {
		this.changeStatusOnDone(this.event).then();
	}

	public async changeStatusOnDone(event: IEvent): Promise<void> {
		await firstValueFrom(this.store.dispatch(new EventActions.DoneStatus(event)));
		await firstValueFrom(this.store.dispatch(new EventActions.GetItem(event._id)));
		this.postStatusChange(EventStatusEnum.done);
		this.store.dispatch(new EventActions.GetList({force: true, resetPage: false, resetParams: false}));
		this.store.dispatch(new RefreshCalendarAction());
	}

}
