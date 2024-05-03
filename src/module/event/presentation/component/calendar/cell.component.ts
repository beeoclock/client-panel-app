import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	HostListener,
	inject,
	Input,
	OnChanges,
	SimpleChanges
} from "@angular/core";
import {NgIf} from "@angular/common";
import {NGXLogger} from "ngx-logger";
import {Store} from "@ngxs/store";
import {RefreshCalendarAction} from "@event/state/calendar/actions/refresh.calendar.action";
import {
	ScrollCalendarDomManipulationService
} from "@event/presentation/dom-manipulation-service/scroll.calendar.dom-manipulation-service";
import {EventActions} from "@event/state/event/event.actions";

@Component({
	selector: 'event-calendar-cell-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		NgIf
	],
	template: `

	`
})
export class CellComponent implements OnChanges {

	@Input()
	public baseId!: string;

	@Input()
	public idSuffix = '';

	@Input()
	public datetimeISO = (new Date()).toISOString();

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
			this.id =  `${this.baseId}-${this.idSuffix}`;
		}
	}

	@HostListener('click', ['$event'])
	public onClick(event: MouseEvent) {
		if (this.scrollCalendarDomManipulationService.isScrolling.isOn) {
			this.ngxLogger.debug('It is not click, it is scrolling');
			return;
		}
		this.ngxLogger.debug('Click', event);
		const callback = () => {
			this.ngxLogger.debug('Callback');
			this.store.dispatch(new RefreshCalendarAction());
		};
		this.store.dispatch(new EventActions.OpenForm({
			componentInputs: {
				datetimeISO: this.datetimeISO,
				callback,
			}
		}));
		event.preventDefault();
		event.stopPropagation();
	}

}
