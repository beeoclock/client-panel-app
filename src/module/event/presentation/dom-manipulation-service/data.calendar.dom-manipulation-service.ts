import {inject, Injectable, Renderer2} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {NGXLogger} from "ngx-logger";
import {IEvent} from "@event/domain";
import {DateTime, Interval} from "luxon";
import {EventStatusEnum} from "@utility/domain/enum/event-status.enum";
import {Store} from "@ngxs/store";

@Injectable()
export class DataCalendarDomManipulationService {

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly renderer2 = inject(Renderer2);
	private readonly document = inject(DOCUMENT);

	private DOMElementCollection: Map<string, HTMLDivElement> = new Map<string, HTMLDivElement>();

	public DOMElementCollectionHas(id: string) {
		return this.DOMElementCollection.has(id);
	}

	public pushDataOrFindAndReplaceIfTheyAreDifferent(event: IEvent) {
		this.ngxLogger.debug('Push data or find and replace if they are different', event);
		const element = this.DOMElementCollection.get(event._id);
		if (element) {
			// Check if status is different
			if (element.dataset.status !== event.status) {
				this.clearById(event._id);
				this.pushData(event);
			}
		} else {
			this.pushData(event);
		}
		return this;
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
		newDiv.dataset.status = event.status;
		newDiv.classList.add('z-10');
		// set absolute position
		newDiv.style.position = 'absolute';
		newDiv.style.maxWidth = divWidth + 'px';
		newDiv.style.top = top + 'px';
		newDiv.style.left = newDivLeft + 'px';

		// Choose color by status
		const classList = [];
		switch (event.status) {
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
				classList.push('bg-green-400', 'border-green-400', 'hover:bg-green-500');
				break;
		}

		// Show time start and finish also show customer name/phone/email and service name
		newDiv.innerHTML = `
			<div style="height: ${heightInPx}px; margin: 2px; padding: 2px;" class="${classList.join(' ')} text-white cursor-pointer transition-all hover:text-white text-ellipsis overflow-hidden break-words h-100 rounded shadow border text-xs">
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
				this.renderer2.listen(node, 'click', (mouseClickEvent) => {
					this.openEventDetails(event);
					mouseClickEvent.stopPropagation();
					mouseClickEvent.preventDefault();
				});

				this.renderer2.listen(node, 'mouseenter', () => {
					newDiv.classList.add('z-20');
				});

				this.renderer2.listen(node, 'mouseleave', () => {
					newDiv.classList.remove('z-20');
				});

				// Only if clientHeight is less than scrollHeight
				if (node.clientHeight < node.scrollHeight) {
					this.renderer2.listen(node, 'mouseenter', () => {
						node.style.height = 'auto';
					});
					this.renderer2.listen(node, 'mouseleave', () => {
						node.style.height = heightInPx + 'px';
					});
				}
			}
		});

		// this.sortChildrenByHeight(cell);

		return this;
	}

	private sortChildrenByHeight(parentElement: HTMLElement): void {
		// Get all child nodes
		const childNodes = Array.from(parentElement.childNodes);

		// Sort child nodes by height
		const sortedNodes = childNodes.sort((a, b) => {
			if (a instanceof HTMLElement && b instanceof HTMLElement) {
				return a.clientHeight - b.clientHeight;
			}
			return 0;
		});

		// Remove all child nodes
		while (parentElement.firstChild) {
			parentElement.firstChild.remove();
		}

		// Append sorted nodes
		sortedNodes.forEach(node => parentElement.appendChild(node));
	}

	private async openEventDetails(event: IEvent) {
		console.log('open', event._id)
		// this.store.dispatch(new EventActions.OpenDetailsById(event._id));
	}

}
