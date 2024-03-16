import {
	AfterViewInit,
	Component,
	ElementRef,
	HostBinding,
	inject,
	Input,
	OnInit,
	ViewEncapsulation
} from "@angular/core";
import {DatePipe, NgIf, NgStyle} from "@angular/common";
import {
	ComposeCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.service";

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
<!--			<div-->
<!--				class="z-20 px-2 py-1 border border-red-500 bg-white rounded-l-2xl rounded-b-2xl text-xs text-right text-red-500 uppercase font-bold">-->
<!--				{{ currentDate | date: 'HH:mm' }}-->
<!--			</div>-->
<!--		</div>-->
		<!-- Line -->
		<div class="border-t border-red-400/50 w-full h-1"></div>
	`
})
export class TimeLineComponent implements OnInit, AfterViewInit {

	@Input()
	public currentDate = new Date();

	@HostBinding()
	public class = 'absolute top-0 left-0 w-full flex items-start transition-all';

	@HostBinding()
	public style = '';

	private readonly composeCalendarWithSpecialistsService = inject(ComposeCalendarWithSpecialistsService);
	private readonly elementRef = inject(ElementRef);

	public readonly startTimeToDisplay = this.composeCalendarWithSpecialistsService.startTimeToDisplay;

	public readonly headerHeightInPx = this.composeCalendarWithSpecialistsService.headerHeightInPx;

	public readonly heightInPx = this.composeCalendarWithSpecialistsService.heightInPx;

	public ngOnInit() {

		this.initInterval();
		const hours = this.currentDate.getHours() - this.startTimeToDisplay;
		const minutesInHours = this.currentDate.getMinutes() / 60;
		const top = this.headerHeightInPx + ((hours + minutesInHours) * this.heightInPx);
		this.style += ` top: ${top}px;`;

	}

	public ngAfterViewInit() {
		setTimeout(() => {
			this.elementRef.nativeElement.scrollIntoView({behavior: 'smooth', block: 'center'});
		}, 0);
	}

	public initInterval() {
		const interval = setInterval(() => {
			this.currentDate = new Date();
		}, 1000);
	}

}
