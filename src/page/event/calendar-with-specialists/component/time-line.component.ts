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
	selector: 'event-time-line-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		DatePipe,
		NgIf,
		NgStyle
	],
	template: `
		<!-- Current time -->
<!--		<div class="min-w-[70px] flex justify-end">-->
		<div class="z-[11] border-r border-slate-100 bg-white flex justify-end left-0 min-w-[70px] sticky" [style.transform]="'translateY(-50%)'">
			<div
				class="px-2 py-1 border border-red-500 bg-white rounded-2xl text-xs text-right text-red-500 uppercase font-bold">
				{{ currentDate | date: 'HH:mm' }}
			</div>
		</div>
		<!-- Line -->
		<!--		border-t border-red-400/50 h-1 -->
		<div class="w-full bg-[#f87171] h-[2px]"></div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeLineComponent implements OnInit, AfterViewInit, OnDestroy {

	@Input()
	public currentDate = new Date();

	@HostBinding()
	public class = 'absolute top-0 left-0 w-full flex items-start transition-all';

	@HostBinding()
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
