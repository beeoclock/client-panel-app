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
import {EventFormModalService} from "@event/presentation/dom-manipulation-service/modal/event.form.modal.service";
import {NGXLogger} from "ngx-logger";

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
	public date = (new Date()).toISOString();

	@HostBinding()
	public class = 'clickMe test relative border-slate-100 dark:border-slate-200/5 h-[50px]';

	@HostBinding()
	public style = '';

	@HostBinding()
	public id = '';

	private readonly ngxLogger = inject(NGXLogger);
	private readonly eventFormModalService = inject(EventFormModalService);

	public ngOnChanges(changes: SimpleChanges & { baseId: { currentValue: CellComponent['baseId'] } }) {
		if (changes.baseId) {
			this.id =  `${this.baseId}-${this.idSuffix}`;
		}
	}

	@HostListener('click', ['$event'])
	public onClick(event: MouseEvent) {
		this.ngxLogger.debug('Click', event);
		this.eventFormModalService.openModal({
			date: this.date,
		});
		event.preventDefault();
		event.stopPropagation();
	}

}
