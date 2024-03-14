import {Component, HostBinding, HostListener, inject, Input, ViewEncapsulation} from "@angular/core";
import * as Member from "@member/domain";
import {FilterService} from "@event/presentation/page/calendar-with-specialists/component/filter/filter.service";
import {NGXLogger} from "ngx-logger";
import {EventFormModalService} from "@event/presentation/dom-manipulation-service/modal/event.form.modal.service";
import {
	ScrollCalendarDomManipulationService
} from "@event/presentation/dom-manipulation-service/scroll.calendar.dom-manipulation-service";
import {
	ComposeCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.service";
import {
	DateControlCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/filter/date-control/date-control.calendar-with-specialists.service";
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'event-cell-component',
	template: `
		<div
			class="opacity-0 hover:opacity-100 transition-all flex items-center h-full px-2 cursor-pointer bg-neutral-100 active:bg-blue-400 active:text-white text-neutral-500">
			+ {{ 'keyword.capitalize.add-event' | translate }}
		</div>
	`,
	standalone: true,
	imports: [
		TranslateModule
	],
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
	};

	@Input()
	public column!: {
		member: Member.RIMember | null;
	};

	private readonly dateControlCalendarWithSpecialistsService = inject(DateControlCalendarWithSpecialistsService);
	private readonly composeCalendarWithSpecialistsService = inject(ComposeCalendarWithSpecialistsService);
	private readonly slotInMinutes = this.composeCalendarWithSpecialistsService.slotInMinutes;
	private readonly startTimeToDisplay = this.composeCalendarWithSpecialistsService.startTimeToDisplay;

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

		const datetimeISO = this.dateControlCalendarWithSpecialistsService
			.selectedDate
			.startOf('day')
			.plus({
				hours: this.startTimeToDisplay,
				minutes: this.rowIndex * this.slotInMinutes
			})
			.toJSDate()
			.toISOString();

		this.eventFormModalService.openModal({
			datetimeISO,
			member: this.column.member,
		}, callback).then();

		event.preventDefault();
		event.stopPropagation();
	}

	private readonly filterService = inject(FilterService);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly eventFormModalService = inject(EventFormModalService);
	private readonly scrollCalendarDomManipulationService = inject(ScrollCalendarDomManipulationService);

}
