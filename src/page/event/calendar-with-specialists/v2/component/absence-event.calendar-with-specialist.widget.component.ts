import {ChangeDetectionStrategy, Component, HostBinding, inject, Input, ViewEncapsulation} from "@angular/core";

import {IAttendee, IEvent_V2} from "@event/domain";
import {DatePipe, NgIf} from "@angular/common";
import {Store} from "@ngxs/store";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";
import {TranslateModule} from "@ngx-translate/core";
import {AbsenceActions} from "@absence/state/absence/absence.actions";

@Component({
	selector: 'app-absence-event-calendar-with-specialist-widget-component',
	template: `
		<div class="flex flex-wrap gap-1">
			<div class="w-full flex gap-2 justify-between">
				<div class="text-xs dark:text-sky-100">
					{{ event.start | date: 'HH:mm' }} - {{ event.end | date: 'HH:mm' }}
				</div>
				<div class="dark:text-sky-100 absolute right-2">
					<i class="bi bi-cup-hot-fill"></i>
				</div>
			</div>
			<div class="text-xs font-bold dark:text-sky-100">
				{{ getAttendeesInformation() }}
			</div>
		</div>
		<div class="text-xs font-medium">
			{{ ('absence.type.' + event.originalData.type + '.label') | translate }}
		</div>
		<div *ngIf="event.note" class="text-xs font-medium">
			📓 {{ event.note }}
		</div>
	`,
	standalone: true,
	imports: [
		DatePipe,
		NgIf,
		TranslateModule
	],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbsenceEventCalendarWithSpecialistWidgetComponent {

	@Input()
	public event!: IEvent_V2<IAbsenceDto>;

	private readonly store = inject(Store);


	public async onClick() {
		await this.openAbsenceDetails(this.event);
	}

	@HostBinding('class')
	public get class() {

		// Choose color by status
		const classList = [
			'absolute top-0 bottom-0 left-0 right-0 text-white border-2',
			'transition-all cursor-pointer rounded-md border-[#00000038] p-1 flex flex-col overflow-hidden',
		];

		classList.push('bg-gray-600', 'hover:bg-gray-700'); // 'border-gray-600',

		return classList.join(' ');
	}

	public getAttendeesInformation() {
		return this.event.attendees?.map((attendant) => {
			if (attendant.is !== 'customer') {
				return;
			}

			const {customer} = attendant.originalData as IAttendee;

			if (customer?.firstName) {
				return customer?.firstName;
			}
			if (customer?.phone) {
				return customer?.phone;
			}
			if (customer?.email) {
				return customer?.email;
			}
			return '';
		}).join(', ');
	}

	private async openAbsenceDetails(event: IEvent_V2<IAbsenceDto>) {
		this.store.dispatch(new AbsenceActions.OpenDetails(event.originalData));
	}

}
