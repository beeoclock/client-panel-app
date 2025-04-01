import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	inject,
	Input,
	OnChanges,
	ViewEncapsulation
} from "@angular/core";

import {IAttendee, IEvent_V2} from "@tenant/event/domain";
import {Store} from "@ngxs/store";
import {IAbsence} from "@tenant/absence/domain/interface/i.absence";
import {TranslateModule} from "@ngx-translate/core";
import {DateTime} from "luxon";
import EAbsence from "@tenant/absence/domain/entity/e.absence";
import {
	AbsencePresentationActions
} from "@tenant/absence/infrastructure/state/presentation/absence.presentation.actions";

@Component({
	selector: 'app-absence-event-calendar-with-specialist-widget-component',
	template: `
		<div class="flex flex-wrap gap-1">
			<div class="w-full flex justify-between">
				<div class="text-xs dark:text-sky-100">
					{{ ('absence.type.' + event.originalData.type + '.label') | translate }}
				</div>
				<div class="dark:text-sky-100 absolute right-2 gap-2 flex">
					@if (event.note) {
						<i [title]="event.note" class="bi bi-chat-text"></i>
					}
					<i class="bi bi-cup-hot-fill"></i>
				</div>
			</div>
			<div class="text-xs font-bold dark:text-sky-100">
				{{ getAttendeesInformation() }}
			</div>
		</div>
		<div class="text-xs font-medium">
			{{ startEndTitle }}
		</div>
	`,
	standalone: true,
	imports: [
		TranslateModule,
	],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbsenceEventCalendarWithSpecialistWidgetComponent implements OnChanges {

	@Input()
	public event!: IEvent_V2<IAbsence.DTO>;

	public startEndTitle = '';

	private readonly store = inject(Store);

	@HostBinding('class')
	public get class() {

		// Choose color by status
		const classList = [
			'absolute top-0 bottom-0 left-0 right-0 text-white border-2',
			'transition-all cursor-pointer rounded-md border-[#00000038] px-1 flex flex-col overflow-hidden',
		];

		classList.push('bg-gray-600', 'hover:bg-gray-700'); // 'border-gray-600',

		return classList.join(' ');
	}

	public async onClick() {
		await this.openAbsenceDetails(this.event);
	}

	public ngOnChanges() {
		this.initStartEndTitle();
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

	public initStartEndTitle(): void {

		const {start, end} = this.event;
		const startDateTime = DateTime.fromISO(start);
		const endDateTime = DateTime.fromISO(end);

		if (startDateTime.hasSame(endDateTime, 'day')) {
			this.startEndTitle = `${startDateTime.toFormat('HH:mm')} - ${endDateTime.toFormat('HH:mm')}`;
			return;
		}

		if (startDateTime.hasSame(endDateTime, 'month')) {

			this.startEndTitle = `${startDateTime.toFormat('d')} - ${endDateTime.toFormat('d')} ${endDateTime.toFormat('LLL')}`;

			if (!DateTime.now().hasSame(startDateTime, 'year')) {
				this.startEndTitle += ` ${startDateTime.toFormat('yyyy')}`;
			}

			return;
		}

		if (startDateTime.hasSame(endDateTime, 'year')) {

			this.startEndTitle = `${startDateTime.toFormat('d LLL')} - ${endDateTime.toFormat('d LLL')}`;

			if (!DateTime.now().hasSame(startDateTime, 'year')) {
				this.startEndTitle += ` ${startDateTime.toFormat('yyyy')}`;
			}

			return;
		}

		this.startEndTitle = `${startDateTime.toFormat('d LLL yyyy')} - ${endDateTime.toFormat('d LLL yyyy')}`;

	}

	private async openAbsenceDetails(event: IEvent_V2<IAbsence.DTO>) {
		const entity = EAbsence.fromDTO(event.originalData);
		this.store.dispatch(new AbsencePresentationActions.OpenDetails(entity));
	}

}
