import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	HostListener,
	inject,
	Input,
	ViewEncapsulation
} from "@angular/core";

import {IAttendee, IEvent_V2} from "@event/domain";
import {DatePipe, NgIf} from "@angular/common";
import {Store} from "@ngxs/store";
import {
	ComposeCalendarWithSpecialistsService
} from "@page/event/calendar-with-specialists/component/compose.calendar-with-specialists.service";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";
import {TranslateModule} from "@ngx-translate/core";
import {AbsenceActions} from "@absence/state/absence/absence.actions";
import {DateTime} from "luxon";

@Component({
	selector: 'absence-event-card-component',
	template: `
		<div class="flex flex-wrap gap-1">
			<div class="w-full flex gap-2 justify-between">
				<div class="text-xs dark:text-sky-100">
					{{ event.data.start | date: 'HH:mm' }} - {{ event.data.end | date: 'HH:mm' }}
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
			{{ ('absence.type.' + event.data.originalData.type + '.label') | translate }}
		</div>
		<div *ngIf="event.data.note" class="text-xs font-medium">
			📓 {{ event.data.note }}
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
export class AbsenceEventCardComponent {

	@Input()
	public event!: {
		data: IEvent_V2<IAbsenceDto>;
		card: {
			startTime: number;
			durationInMinutes: number;
			column: number;
		};
	};

	@Input()
	public card!: {
		startTime: number;
		durationInMinutes: number;
		column: number;
	};

	private readonly composeCalendarWithSpecialistsService = inject(ComposeCalendarWithSpecialistsService);
	private readonly store = inject(Store);

	public readonly startTimeToDisplay = this.composeCalendarWithSpecialistsService.startTimeToDisplay;

	@HostListener('click')
	public async onClick() {
		await this.openAbsenceDetails(this.event.data);
	}

	@HostBinding('style.margin-top')
	public get marginTop() {

		const {start} = this.event.data;
		const {
			oneHourHeightInPx,
			oneHoursInMinutes,
			// slotInMinutes
		} = this.composeCalendarWithSpecialistsService;

		// Take hours and minutes from the start time
		const startDateTime = DateTime.fromISO(start);
		const startHourWithoutStartTimeToDisplay = startDateTime.hour - this.startTimeToDisplay;

		if (startHourWithoutStartTimeToDisplay < 0) {
			return '0px';
		}

		const startInMinutes = (startHourWithoutStartTimeToDisplay * 60) + startDateTime.minute;

		return `${(oneHourHeightInPx / oneHoursInMinutes) * startInMinutes}px`;
	}

	// Calculate the end of the event in px but it should be proportional to the slot size
	@HostBinding('style.height')
	public get height() {
		// return (this.card.startTime > 0 ? (((this.card.startTime - this.startTimeToDisplay) * this.stepPerHour) + 1) : 1) + (this.card.durationInMinutes / this.slotInMinutes);

		const {
			oneHourHeightInPx,
			oneHoursInMinutes,
			// slotInMinutes
		} = this.composeCalendarWithSpecialistsService;
		// const defaultHeight = (oneHourHeightInPx / oneHoursInMinutes) * slotInMinutes; // (180/60)*10 = 30px
		let height = 0;

		// Calculate height
		// Take duration of the event
		const duration = this.card.durationInMinutes;

		height = (oneHourHeightInPx / oneHoursInMinutes) * duration;

		return `${height}px`;
	}

	@HostBinding('style.grid-column-start')
	public get gridColumnStart() {
		return this.card.column;
	}

	@HostBinding('class')
	public get class() {

		// Choose color by status
		const classList = [
			'relative transition-all hover:cursor-pointer z-[11] border-2 rounded-md border-[#00000038] p-1 flex flex-col text-white overflow-hidden',
		];

		classList.push('bg-gray-600', 'hover:bg-gray-700'); // 'border-gray-600',

		return classList.join(' ');
	}

	public getAttendeesInformation() {
		return this.event.data.attendees?.map((attendant) => {
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
