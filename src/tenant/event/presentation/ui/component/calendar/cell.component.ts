import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	HostListener,
	inject,
	input,
	OnChanges,
	SimpleChanges
} from "@angular/core";
import {NGXLogger} from "ngx-logger";
import {Store} from "@ngxs/store";
import {RefreshCalendarAction} from "@tenant/event/infrastructure/state/calendar/actions/refresh.calendar.action";
import {
	ScrollCalendarDomManipulationService
} from "@tenant/event/presentation/dom-manipulation-service/scroll.calendar.dom-manipulation-service";

@Component({
	selector: 'event-calendar-cell-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	template: `

	`
})
export class CellComponent implements OnChanges {

	public readonly baseId = input.required<string>();

	public readonly idSuffix = input('');

	public readonly datetimeISO = input((new Date()).toISOString());

	@HostBinding()
	public class = 'clickMe test relative border-slate-100 dark:border-slate-200/5 h-[50px]';

	@HostBinding()
	public style = '';

	@HostBinding()
	public id = '';

	private readonly ngxLogger = inject(NGXLogger);
	private readonly store = inject(Store);
	private readonly scrollCalendarDomManipulationService = inject(ScrollCalendarDomManipulationService);

	public ngOnChanges(changes: SimpleChanges & { baseId: { currentValue: CellComponent['baseId'] } }) {
		if (changes.baseId) {
			this.id = `${this.baseId()}-${this.idSuffix()}`;
		}
	}

	@HostListener('click', ['$event'])
	public onClick(event: MouseEvent) {
		this.ngxLogger.debug('Click', event);
		if (this.scrollCalendarDomManipulationService.isScrolling.isOn) {
			this.ngxLogger.debug('It is not click, it is scrolling');
			return;
		}
		this.ngxLogger.debug('Click', event);
		const callback = () => {
			this.ngxLogger.debug('Callback');
			this.store.dispatch(new RefreshCalendarAction());
		};
		// this.store.dispatch(new EventActions.OpenForm({
		// 	componentInputs: {
		// 		datetimeISO: this.datetimeISO,
		// 		callback,
		// 	}
		// }));
		event.preventDefault();
		event.stopPropagation();
	}

}
