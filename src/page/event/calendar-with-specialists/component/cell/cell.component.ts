import {Component, HostBinding, HostListener, inject, Input, ViewEncapsulation} from "@angular/core";
import * as Member from "@member/domain";
import {NGXLogger} from "ngx-logger";
import {
	ScrollCalendarDomManipulationService
} from "@event/presentation/dom-manipulation-service/scroll.calendar.dom-manipulation-service";

import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {CalendarWithSpecialistsAction} from "@event/state/calendar-with-specialists/calendar-with-specialists.action";
import {CalendarWithSpecialistsQueries} from "@event/state/calendar-with-specialists/calendar–with-specialists.queries";
import {firstValueFrom} from "rxjs";
import {PushBoxService} from "@utility/presentation/component/push-box/push-box.service";
import {AdditionalMenuComponent} from "@event/presentation/component/additional-menu/additional-menu.component";
import {
	ComposeCalendarWithSpecialistsService
} from "@page/event/calendar-with-specialists/component/compose.calendar-with-specialists.service";

@Component({
	selector: 'event-cell-component',
	template: `
		<div
			class="active:bg-blue-400 active:text-white bg-neutral-100 border-2 border-[#00000038] cursor-pointer flex h-full hover:opacity-100 items-center opacity-0 px-2 rounded-md text-neutral-500 transition-all">
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

	private readonly store = inject(Store);
	public readonly selectedDate$ = this.store.select(CalendarWithSpecialistsQueries.start);

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
		return 'border-slate-100 dark:border-slate-200/5 border-r z-10';
	}

	@HostBinding('class.border-b')
	public get borderB() {
		return this.row.isFirstOrLastRowOfHour;
	}

	@HostListener('click', ['$event'])
	public async onClick(event: MouseEvent) {
		if (this.scrollCalendarDomManipulationService.isScrolling.isOn) {
			return;
		}

		const title = this.translateService.instant('event.additionalMenu.title');

		const selectedDate = await firstValueFrom(this.selectedDate$);

		const callback = () => {
			this.ngxLogger.debug('Callback');
			this.store.dispatch(new CalendarWithSpecialistsAction.GetItems());
		};

		const datetimeISO = selectedDate
			.startOf('day')
			.plus({
				hours: this.startTimeToDisplay,
				minutes: this.rowIndex * this.slotInMinutes
			})
			.toJSDate()
			.toISOString();

		await this.pushBoxService.buildItAsync({
			component: AdditionalMenuComponent,
			title,
			componentInputs: {
				datetimeISO,
				member: this.column.member ?? undefined,
				callback
			}
		});


		event.preventDefault();
		event.stopPropagation();
	}

	private readonly translateService = inject(TranslateService);
	private readonly pushBoxService = inject(PushBoxService);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly scrollCalendarDomManipulationService = inject(ScrollCalendarDomManipulationService);

}
