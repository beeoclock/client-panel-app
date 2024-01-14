import {inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {NGXLogger} from "ngx-logger";
import {IEvent} from "@event/domain";
import {DateTime, Interval} from "luxon";
import {EventDetailsModalService} from "@event/presentation/dom-manipulation-service/modal/event.details.modal.service";

@Injectable({
	providedIn: 'root'
})
export class DataCalendarDomManipulationService {

	private readonly eventDetailsModalService = inject(EventDetailsModalService);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly document = inject(DOCUMENT);

	private DOMElementCollection: Map<string, HTMLDivElement> = new Map<string, HTMLDivElement>();

	public DOMElementCollectionHas(id: string) {
		return this.DOMElementCollection.has(id);
	}

	public clearAll() {
		this.ngxLogger.debug('Clear all');
		this.DOMElementCollection.forEach((value, key) => {
			value.remove();
			this.DOMElementCollection.delete(key);
		});
		return this;
	}

	public clearById(id: string) {
		this.ngxLogger.debug('Clear by id', id);
		const element = this.DOMElementCollection.get(id);
		if (element) {
			element.remove();
			this.DOMElementCollection.delete(id);
		}
		return this;
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

		this.ngxLogger.debug('Push data', event);

		// Calculate px for new div in px, 100% = 50px (height of hour) so 1 hour = 50px so we should calculate how many hours between start and end
		// 1. Get start and end time
		const startDateTime = DateTime.fromISO(event.start ?? '');
		const endDateTime = DateTime.fromISO(event.end ?? '');
		// 2. Calculate minutes between start and end
		const hoursBetweenStartAndEnd = Interval.fromDateTimes(startDateTime, endDateTime).length('hours');
		const minutesBetweenStartAndEnd = Interval.fromDateTimes(startDateTime, endDateTime).length('minutes');
		// 3. Convert difference to px
		const marginAndBorder = 6; // 6 px is margin and border
		const heightInPx = (minutesBetweenStartAndEnd / 60 * 50) - marginAndBorder;

		// Next we should detect top position of new div
		const top = startDateTime.minute / 60 * 50;

		const cell = this.document.getElementById(startDateTime.toFormat('dd.MM.yyyy-HH:00'));
		if (!cell) {
			return this;
		}

		const cellWidth = cell.clientWidth;
		const futureChildrenAmount = cell.childElementCount + 1;
		let divWidth = cellWidth;
		let newDivLeft = 0;

		// 4. Calculate with of div:
		// 4.1. First of all we should check if the cell already has some div,

		if (cell.childElementCount > 0) {

			const fantomDivs = Array.from(cell.children).filter((node) => node instanceof HTMLDivElement && node.dataset.fantom);
			const thereAreOnlyFantomDivs = cell.childElementCount === fantomDivs.length;

			if (thereAreOnlyFantomDivs) {

				// Check if fantom divs are full height
				const thereSomeFantomDivsAreFullHeight = fantomDivs.some((node) => node.clientHeight === 50);
				if (thereSomeFantomDivsAreFullHeight) {

					divWidth = cellWidth / futureChildrenAmount;
					newDivLeft = (futureChildrenAmount - 1) * divWidth;

				}

			} else {

				divWidth = cellWidth / futureChildrenAmount;
				newDivLeft = (futureChildrenAmount - 1) * divWidth;

			}
			// Change width of existing div
			cell.childNodes.forEach((node) => {
				if (node instanceof HTMLDivElement) {
					node.style.maxWidth = divWidth + 'px';
					if (node.dataset.eventId) {
						const prevDOMElementEvent = this.DOMElementCollection.get(node.dataset.eventId);
						if (prevDOMElementEvent) {
							prevDOMElementEvent.style.maxWidth = divWidth + 'px';
						}
					}
				}
			});
		}

		// 4.2. Second we take height and check next cells to get information about existing divs;
		// 4.2.1 Use hoursBetweenStartAndEnd to get amount of cells and check if endDateTime is in next cell
		if (hoursBetweenStartAndEnd > 1) {

			for (let hours = 1; hours < hoursBetweenStartAndEnd; hours++) {
				const nextStartDateTime = startDateTime.plus({hours});
				const nextCell = this.document.getElementById(nextStartDateTime.toFormat('dd.MM.yyyy-HH:00'));
				if (!nextCell) {
					continue;
				}

				const newDivWidth = nextCell.clientWidth / (nextCell.childElementCount + 1);

				let fantomHeight = 50;
				const fantomTop = 0;

				// Check if next cell is last cell
				if (nextStartDateTime.toFormat('dd.MM.yyyy-HH:00') === endDateTime.toFormat('dd.MM.yyyy-HH:00')) {
					fantomHeight = (endDateTime.minute / 60) * 50;
				}

				if (nextCell.childElementCount > 0) {
					// Change width of existing div
					nextCell.childNodes.forEach((node) => {
						if (node instanceof HTMLDivElement) {
							node.style.maxWidth = newDivWidth + 'px';
							node.style.left = nextCell.childElementCount * newDivWidth + 'px';
						}
					});
				}

				// Add fantom div to get width of next cell
				const fantom = this.document.createElement("div");
				// set absolute position
				fantom.style.position = 'absolute';
				fantom.style.width = divWidth + 'px';
				fantom.style.height = fantomHeight + 'px';
				fantom.style.top = fantomTop + 'px';
				fantom.style.left = cell.childElementCount * divWidth + 'px';
				fantom.dataset.fantom = 'true';
				fantom.dataset.eventId = event._id;

				nextCell.appendChild(fantom);
			}
		} else if (endDateTime.toFormat('dd.MM.yyyy-HH:00') !== startDateTime.toFormat('dd.MM.yyyy-HH:00')) {
			// Check if endDateTime is in next cell
			const nextCell = this.document.getElementById(endDateTime.toFormat('dd.MM.yyyy-HH:00'));

			if (nextCell) {
				const newDivWidth = nextCell.clientWidth / (nextCell.childElementCount + 1);

				if (nextCell.childElementCount > 0) {
					// Change width of existing div
					nextCell.childNodes.forEach((node) => {
						if (node instanceof HTMLDivElement) {
							node.style.maxWidth = newDivWidth + 'px';
							node.style.left = nextCell.childElementCount * newDivWidth + 'px';
						}
					});
				}

				const fantomHeight = (endDateTime.minute / 60) * 50;
				const fantomTop = 0;

				// Add fantom div to get width of next cell
				const fantom = this.document.createElement("div");
				// set absolute position
				fantom.style.position = 'absolute';
				fantom.style.width = divWidth + 'px';
				fantom.style.height = fantomHeight + 'px';
				fantom.style.top = fantomTop + 'px';
				fantom.style.left = cell.childElementCount * divWidth + 'px';
				fantom.dataset.fantom = 'true';
				fantom.dataset.eventId = event._id;

				nextCell.appendChild(fantom);
			}
		}

		const newDiv = this.document.createElement("div");
		newDiv.id = event._id;
		newDiv.dataset.isEventData = 'true';
		newDiv.classList.add('z-10');
		// set absolute position
		newDiv.style.position = 'absolute';
		newDiv.style.maxWidth = divWidth + 'px';
		newDiv.style.top = top + 'px';
		newDiv.style.left = newDivLeft + 'px';
		// Show time start and finish also show customer name/phone/email and service name
		newDiv.innerHTML = `
			<div style="height: ${heightInPx}px; margin: 2px; padding: 2px;" class="cursor-pointer hover:bg-blue-500 transition-all hover:text-white text-ellipsis overflow-hidden break-words bg-blue-400/20 h-100 rounded shadow border border-blue-200 text-xs text-slate-400 dark:bg-slate-800">
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

		cell.appendChild(newDiv);

		this.DOMElementCollection.set(newDiv.id, newDiv);

		newDiv.childNodes.forEach((node) => {
			if (node instanceof HTMLDivElement) {
				node.addEventListener('click', () => {
					this.openEventDetails(event);
				});

				node.addEventListener('mouseenter', () => {
					newDiv.classList.add('z-20');
				});

				node.addEventListener('mouseleave', () => {
					newDiv.classList.remove('z-20');
				});

				// Only if clientHeight is less than scrollHeight
				console.log(node.clientHeight, node.scrollHeight)
				if (node.clientHeight < node.scrollHeight) {
					node.addEventListener('mouseenter', () => {
						node.style.height = 'auto';
					});
					node.addEventListener('mouseleave', () => {
						node.style.height = heightInPx + 'px';
					});
				}
			}
		});

		// TODO: Sort divs by height

		return this;
	}

	private async openEventDetails(event: IEvent) {
		console.log(event);
		await this.eventDetailsModalService.openModal(event._id);
	}

}
