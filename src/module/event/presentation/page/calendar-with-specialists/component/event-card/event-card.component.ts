import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	HostListener,
	inject,
	Input,
	ViewEncapsulation
} from "@angular/core";
import {
	ComposeCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.service";
import {EventDetailsModalService} from "@event/presentation/dom-manipulation-service/modal/event.details.modal.service";
import {IEvent, RIEvent} from "@event/domain";
import {DatePipe} from "@angular/common";
import {EventStatusEnum} from "@utility/domain/enum/event-status.enum";

@Component({
	selector: 'event-card-component',
	template: `
		<div class="flex flex-wrap gap-1">
			<span class="text-xs dark:text-sky-100">
			{{ event.data.start | date: 'HH:mm' }} - {{ event.data.end | date: 'HH:mm' }}
		</span>
			<span class="text-xs font-bold dark:text-sky-100">
			{{ getAttendeesInformation() }}
		</span>
		</div>
		<span class="text-xs font-medium line-clamp-2">
			{{ event.data.services[0].languageVersions[0].title }}
		</span>
	`,
	standalone: true,
	imports: [
		DatePipe
	],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
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
		neighbors: RIEvent[];
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

	// Use neighbors property to calculate width in percentage
	// @HostBinding('style.width')
	// public get width() {
	// 	// Find each neighbor DOM element and bunch the width
	// 	let widthOfNeighbors = 0;
	// 	this.card.neighbors.forEach((neighbor) => {
	// 		const neighborElement = document.getElementById(neighbor._id) as HTMLElement;
	// 		widthOfNeighbors += neighborElement?.offsetWidth ?? 0;
	// 	});
	// 	console.log(widthOfNeighbors);
	//
	// 	// ${100 / (this.card.neighbors.length + 1)}%
	//
	// 	if (widthOfNeighbors === 0) {
	// 		return `${100 / (this.card.neighbors.length + 1)}%`;
	// 	}
	//
	// 	return `max(${100 / (this.card.neighbors.length + 1)}%, calc(100% - ${widthOfNeighbors}px))`;
	// 	// return `calc(100% - ${widthOfNeighbors}px)`;
	// }

	// @HostBinding('style.margin-left')
	// public get marginLeft() {
	//
	// }

	@HostBinding('class')
	public get class() {


		// Choose color by status
		const classList = [
			'transition-all hover:cursor-pointer z-10 border rounded-lg m-1 p-1 flex flex-col text-white',
		];

		switch (this.event.data.status) {
			case EventStatusEnum.rejected:
			case EventStatusEnum.cancelled:
				classList.push('bg-red-400', 'border-red-400', 'hover:bg-red-500');
				break;
			case EventStatusEnum.requested:
				classList.push('bg-orange-400', 'border-orange-500', 'hover:bg-orange-500');
				break;
			case EventStatusEnum.booked:
				classList.push('bg-blue-400', 'border-blue-400', 'hover:bg-blue-500');
				break;
			case EventStatusEnum.done:
				classList.push('bg-green-500', 'border-green-500', 'hover:bg-green-600');
				break;
		}

		return classList.join(' ');
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
