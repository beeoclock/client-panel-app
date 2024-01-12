import {inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {NGXLogger} from "ngx-logger";
import {IEvent} from "@event/domain";
import {DateTime, Interval} from "luxon";

@Injectable({
	providedIn: 'root'
})
export class DataCalendarDomManipulationService {

	private readonly ngxLogger = inject(NGXLogger);
	private readonly document = inject(DOCUMENT);

	private DOMElementCollection: HTMLDivElement[] = [];

	public clearAll() {
		this.DOMElementCollection.forEach((element) => {
			element.remove();
		});
		this.DOMElementCollection = [];
	}

	/**
	 * this.calendarDomManipulationService
	 * 			.pushData('02.01.2024-18')
	 * 			.pushData('04.01.2024-8')
	 * 			.pushData('06.01.2024-14');
	 *
	 * @param event
	 */
	public pushData(event: IEvent) {

		// Calculate px for new div in px, 100% = 50px (height of hour) so 1 hour = 50px so we should calculate how many hours between start and end
		// 1. Get start and end time
		const startDateTime = DateTime.fromISO(event.start ?? '');
		const endDateTime = DateTime.fromISO(event.end ?? '');
		// 2. Calculate minutes between start and end
		const minutesBetweenStartAndEnd = Interval.fromDateTimes(startDateTime, endDateTime).length('minutes');
		// 3. Convert difference to px
		const heightInPx = minutesBetweenStartAndEnd / 60 * 50;

		// Next we should detect top position of new div
		const top = startDateTime.minute / 60 * 50;

		const newDiv = this.document.createElement("div");
		// set absolute position
		newDiv.style.position = 'absolute';
		newDiv.style.maxWidth = '100%';
		newDiv.style.top = top + 'px';
		// Show time start and finish also show customer name/phone/email and service name
		newDiv.innerHTML = `
			<div style="height: ${heightInPx}px" class="cursor-pointer hover:bg-blue-500 transition-all hover:text-white text-ellipsis overflow-hidden break-words bg-blue-400/20 h-100 border-slate-100 dark:border-slate-200/5 text-xs p-1 text-slate-400 dark:bg-slate-800">
				${startDateTime.toFormat('HH:mm')} - ${endDateTime.toFormat('HH:mm')},
				${event.attendees?.map(({customer}) => {
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
				}).join(', ')},
				${event.services?.map(({languageVersions: [firstLanguageVersion]}) => firstLanguageVersion.title)?.join(', ')}
			</div>
		`;

		newDiv.addEventListener('click', () => {
			this.openEventDetails(event);
		});

		const cell = this.document.getElementById(startDateTime.toFormat('dd.MM.yyyy-HH:00'));
		if (!cell) {
			return this;
		}

		// set relative position
		cell.style.position = 'relative';
		cell.appendChild(newDiv);

		this.DOMElementCollection.push(newDiv);

		return this;
	}

	private openEventDetails(event: IEvent) {
		console.log(event);
	}

}
