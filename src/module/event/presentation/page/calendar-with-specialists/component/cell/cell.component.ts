import {Component, HostBinding, HostListener, inject, Input, ViewEncapsulation} from "@angular/core";
import * as Member from "@member/domain";
import {FilterService} from "@event/presentation/page/calendar-with-specialists/component/filter/filter.service";
import {NGXLogger} from "ngx-logger";
import {EventFormModalService} from "@event/presentation/dom-manipulation-service/modal/event.form.modal.service";
import {
	ScrollCalendarDomManipulationService
} from "@event/presentation/dom-manipulation-service/scroll.calendar.dom-manipulation-service";

@Component({
	selector: 'event-cell-component',
	template: `
		<div class="opacity-0 hover:opacity-100 transition-all flex items-center h-full px-2 cursor-pointer bg-neutral-100 active:bg-blue-400 active:text-white text-neutral-500">
			+ Dodaj
		</div>
	`,
	standalone: true,
	encapsulation: ViewEncapsulation.None
})
export class CellComponent {

	@Input()
	public rowIndex!: number;

	@Input()
	public columnIndex!: number;

	@Input()
	public row!: {
		isFirstOrLastRowOfHour: boolean;
		datetimeISO: string;
	};

	@Input()
	public column!: {
		member: Member.RIMember | null;
	};

	@HostBinding('style.grid-row-start')
	public get gridRowStart() {
		return this.rowIndex + 1;
	}

	@HostBinding('style.grid-column-start')
	public get gridColumnStart() {
		return this.columnIndex;
	}

	@HostBinding()
	public get class() {
		return 'border-slate-100 dark:border-slate-200/5 border-r';
	}

	@HostBinding('class.border-b')
	public get borderB() {
		return this.row.isFirstOrLastRowOfHour;
	}

	@HostListener('click', ['$event'])
	public onClick(event: MouseEvent) {
		if (this.scrollCalendarDomManipulationService.isScrolling.isOn) {
			return;
		}
		const callback = () => {
			this.ngxLogger.debug('Callback');
			this.filterService.forceRefresh();
		};
		this.eventFormModalService.openModal({
			datetimeISO: this.row.datetimeISO,
			member: this.column.member,
		}, callback);
		console.log('SlotFrameComponent.onClick', this);
		event.preventDefault();
		event.stopPropagation();
	}

	private readonly filterService = inject(FilterService);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly eventFormModalService = inject(EventFormModalService);
	private readonly scrollCalendarDomManipulationService = inject(ScrollCalendarDomManipulationService);

}
