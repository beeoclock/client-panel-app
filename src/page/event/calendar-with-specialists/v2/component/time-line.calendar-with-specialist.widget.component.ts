import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostBinding,
	inject,
	Input,
	OnDestroy,
	OnInit,
	ViewEncapsulation
} from "@angular/core";
import {DatePipe, NgIf, NgStyle} from "@angular/common";
import {
	ComposeCalendarWithSpecialistsService
} from "@page/event/calendar-with-specialists/component/compose.calendar-with-specialists.service";

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
		<div class="border-2 border-red-500 bg-white rounded-b-md flex justify-end left-0 sticky w-[50px]">
			<div
				class="py-1 rounded-2xl text-sm text-center text-red-500 uppercase font-bold w-[50px]">
				{{ currentDate | date: 'HH:mm' }}
			</div>
		</div>
		<!-- Line -->
		<div class="w-full bg-[#f87171] h-[2px]"></div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeLineCalendarWithSpecialistWidgetComponent implements OnInit, AfterViewInit, OnDestroy {

	@Input()
	public currentDate = new Date();

	@HostBinding()
	public class = 'absolute flex items-start left-0 top-0 transition-all z-[11] w-[100vh] md:w-full';

	@HostBinding('style.height')
	public height = '0';

	@HostBinding('style')
	public style = '';

	private readonly composeCalendarWithSpecialistsService = inject(ComposeCalendarWithSpecialistsService);
	private readonly elementRef = inject(ElementRef);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	public readonly startTimeToDisplay = this.composeCalendarWithSpecialistsService.startTimeToDisplay;

	public readonly headerHeightInPx = this.composeCalendarWithSpecialistsService.headerHeightInPx;

	public readonly heightInPx = this.composeCalendarWithSpecialistsService.oneHourHeightInPx;

	private interval: NodeJS.Timer | null = null;

	public ngOnInit() {

		this.calculateTopPosition();
		this.initInterval();

	}

	public ngAfterViewInit() {
		setTimeout(() => {
			this.elementRef.nativeElement.scrollIntoView({behavior: 'smooth', block: 'center'});
		}, 0);
	}

	public initInterval() {
		this.interval = setInterval(() => {
			this.currentDate = new Date();
			this.calculateTopPosition();
			this.changeDetectorRef.detectChanges();
		}, 1000);
	}

	public ngOnDestroy() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	public calculateTopPosition() {

		const hours = this.currentDate.getHours() - this.startTimeToDisplay;
		const minutesInHours = this.currentDate.getMinutes() / 60;
		const top = this.headerHeightInPx + ((hours + minutesInHours) * this.heightInPx);
		this.style += ` top: ${top}px;`;

	}

}
