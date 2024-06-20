import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostBinding,
	inject,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	SimpleChanges,
	ViewEncapsulation
} from "@angular/core";
import {DatePipe, NgIf, NgStyle} from "@angular/common";
import {
	CalendarWithSpecialistLocaStateService
} from "@page/event/calendar-with-specialists/v2/calendar-with-specialist.loca.state.service";

@Component({
	selector: 'app-time-line-calendar-with-specialist-widget-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		DatePipe,
		NgIf,
		NgStyle
	],
	template: `
		<!-- Current time -->
		<div *ngIf="showCurrentTime" class="border-2 border-red-500 bg-white rounded-b-lg flex justify-end left-0 sticky w-full">
			<div
				class="py-1 rounded-2xl text-sm text-center text-red-500 uppercase font-bold w-full">
				{{ currentDate | date: 'HH:mm' }}
			</div>
		</div>
		<!-- Line -->
		<div *ngIf="showLine" class="w-full bg-[#f87171] h-[2px]"></div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeLineCalendarWithSpecialistWidgetComponent implements OnInit, OnDestroy, OnChanges {

	@Input()
	public currentDate = new Date();

	@Input()
	public showCurrentTime = true;

	@Input()
	public showLine = true;

	@HostBinding()
	public class = 'absolute flex items-start left-0 top-0 transition-all z-[11] w-full';

	@HostBinding('style.height')
	public height = '0';

	@HostBinding('style')
	public style = '';

	private readonly calendarWithSpecialistLocaStateService = inject(CalendarWithSpecialistLocaStateService);
	private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	public readonly startTimeToDisplay = this.calendarWithSpecialistLocaStateService.startTimeToDisplay;

	public readonly headerHeightInPx = this.calendarWithSpecialistLocaStateService.specialistCellHeightForPx;

	public readonly heightInPx = this.calendarWithSpecialistLocaStateService.oneHourForPx;

	private interval: NodeJS.Timer | null = null;

	public ngOnChanges(changes: SimpleChanges) {
		if (changes.currentDate) {
			this.init();
		}

	}

	public ngOnInit() {

		this.init();

	}

	public init() {
		this.calculateTopPosition();
		this.initInterval();
	}

	public initInterval() {
		this.clearInterval();
		this.interval = setInterval(() => {
			this.currentDate = new Date();
			this.calculateTopPosition();
			this.changeDetectorRef.detectChanges();
		}, 1_000);
	}

	public ngOnDestroy() {
		this.clearInterval();
	}

	private clearInterval() {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
	}

	public calculateTopPosition() {

		const hours = this.currentDate.getHours() - this.startTimeToDisplay;
		const minutesInHours = this.currentDate.getMinutes() / 60;
		const top = this.headerHeightInPx + ((hours + minutesInHours) * this.heightInPx);
		this.style += ` top: ${top}px;`;

	}

}
