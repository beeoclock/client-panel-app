import {Component, HostBinding, HostListener, inject, Input, ViewEncapsulation} from "@angular/core";
import {
	ComposeCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.service";
import {EventDetailsModalService} from "@event/presentation/dom-manipulation-service/modal/event.details.modal.service";
import {IEvent, RIEvent} from "@event/domain";
import {DatePipe} from "@angular/common";

@Component({
	selector: 'event-card-component',
	template: `
		<span class="text-xs text-blue-600 dark:text-sky-100">
			{{ event.data.start | date: 'HH:mm' }} - {{ event.data.end | date: 'HH:mm' }}
		</span>
		<span class="text-xs font-medium text-blue-600 dark:text-sky-100">
			{{ getAttendeesInformation() }}
		</span>
		<span class="text-xs font-medium text-blue-600 dark:text-sky-100">
			{{ event.data.services[0].languageVersions[0].title }}
		</span>
	`,
	standalone: true,
	imports: [
		DatePipe
	],
	encapsulation: ViewEncapsulation.None
})
export class EventCardComponent {

	@Input()
	public event!: {
		data: RIEvent;
		cards: {
			startTime: number;
			durationInMinutes: number;
			column: number;
		}[];
	};

	@Input()
	public card!: {
		startTime: number;
		durationInMinutes: number;
		column: number;
	};

	private readonly composeCalendarWithSpecialistsService = inject(ComposeCalendarWithSpecialistsService);
	private readonly eventDetailsModalService = inject(EventDetailsModalService);

	public readonly slotInMinutes = this.composeCalendarWithSpecialistsService.slotInMinutes;
	public readonly startTimeToDisplay = this.composeCalendarWithSpecialistsService.startTimeToDisplay;
	public readonly stepPerHour = this.composeCalendarWithSpecialistsService.stepPerHour;

	@HostListener('click')
	public async onClick() {
		await this.openEventDetails(this.event.data);
	}

	@HostBinding('style.grid-row-start')
	public get gridRowStart() {
		return this.card.startTime > 0 ? ((this.card.startTime - this.startTimeToDisplay) * this.stepPerHour) + 1 : 1;
	}

	@HostBinding('style.grid-row-end')
	public get gridRowEnd() {
		return (this.card.startTime > 0 ? (((this.card.startTime - this.startTimeToDisplay) * this.stepPerHour) + 1) : 1) + (this.card.durationInMinutes / this.slotInMinutes);
	}

	@HostBinding('style.grid-column-start')
	public get gridColumnStart() {
		return this.card.column;
	}

	@HostBinding('class')
	public get class() {
		return 'transition-all hover:cursor-pointer hover:bg-blue-500 z-10 bg-blue-400/20 dark:bg-sky-600/50 border border-blue-700/10 dark:border-sky-500 rounded-lg m-1 p-1 flex flex-col';
	}

	public getAttendeesInformation() {
		return this.event.data.attendees?.map(({customer}) => {
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

	private async openEventDetails(event: IEvent) {
		await this.eventDetailsModalService.openModal(event._id);
	}

}
