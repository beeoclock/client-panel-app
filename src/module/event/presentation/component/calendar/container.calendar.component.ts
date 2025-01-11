import {
	AfterViewInit,
	Component,
	ElementRef,
	HostBinding,
	inject,
	input,
	QueryList,
	ViewChild,
	ViewChildren
} from "@angular/core";
import {ColumnsBlockComponent} from "@event/presentation/component/calendar/columns-block.component";
import {HoursComponent} from "@event/presentation/component/calendar/hours.component";
import {NgForOf} from "@angular/common";
import {
	ScrollCalendarDomManipulationService
} from "@event/presentation/dom-manipulation-service/scroll.calendar.dom-manipulation-service";
import {NGXLogger} from "ngx-logger";

@Component({
	selector: 'event-calendar-container-component',
	// changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	providers: [
		ScrollCalendarDomManipulationService
	],
	imports: [
		ColumnsBlockComponent,
		HoursComponent,
		NgForOf
	],
	template: `

		<event-calendar-hours-component
			[currentDate]="currentDate()"
			#hoursComponent/>

		<event-calendar-columns-block-component
			*ngFor="let preferences of preferencesOfCalendars()"
			[id]="preferences.from.toISOString()"
			[preferences]="preferences"/>

		<!-- <event-calendar-speed-dial-component/> -->

	`
})
export class ContainerCalendarComponent implements AfterViewInit {

	public readonly currentDate = input<Date>(new Date());

	public readonly preferencesOfCalendars = input<{
    from: Date;
    to: Date;
}[]>([]);

	@ViewChildren(ColumnsBlockComponent)
	public calendarsRef!: QueryList<ColumnsBlockComponent>;

	@ViewChild(HoursComponent)
	public hoursComponentRef!: HoursComponent;

	@HostBinding()
	public class = 'bg-white	flex overflow-auto h-[calc(100dvh-64px)] md:h-full relative';

	public readonly elementRef = inject(ElementRef);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly scrollCalendarDomManipulationService = inject(ScrollCalendarDomManipulationService);

	// Ref to last, first and current calendars
	private currentCalendarRef: ColumnsBlockComponent | null = null;

	public ngAfterViewInit() {

		this.scrollCalendarDomManipulationService
			.setNativeElement(this.elementRef.nativeElement)
			.initDesktopMouseHandle();

	}

	/**
	 * @description Init handler on horizontal scroll
	 * @private
	 */
	public initHandlerOnHorizontalScroll(prevCallback: () => void, nextCallback: () => void) {
		const containerOfCalendarsNativeElement: HTMLElement = this.elementRef.nativeElement;

		this.ngxLogger.debug('containerOfCalendarsNativeElement', containerOfCalendarsNativeElement);

		containerOfCalendarsNativeElement.addEventListener('scroll', () => {
			if (!this.currentCalendarRef) {
				return;
			}

			const currentCalendarNativeElement: HTMLElement = this.currentCalendarRef.elementRef.nativeElement;
			const firstHalfOfCalendarPosition = currentCalendarNativeElement.scrollWidth / 2;
			const lastHalfOfCalendarPosition = containerOfCalendarsNativeElement.scrollWidth - firstHalfOfCalendarPosition;

			if (containerOfCalendarsNativeElement.scrollLeft <= firstHalfOfCalendarPosition) {
				prevCallback();
			}

			if ((containerOfCalendarsNativeElement.scrollLeft + currentCalendarNativeElement.scrollWidth) >= lastHalfOfCalendarPosition) {
				nextCallback();
			}

		});
	}

	/**
	 * @description Scroll to correct position
	 * @param prevScrollPosition - previous scroll position
	 * @private
	 */
	public scrollToCorrectPosition(prevScrollPosition: number) {

		if (!this.currentCalendarRef) {
			return;
		}

		// Scroll to prevScrollPosition + width of calendar
		const containerHTML = this.elementRef.nativeElement as HTMLElement;
		containerHTML.scrollTo({
			left: prevScrollPosition + this.currentCalendarRef.elementRef.nativeElement.scrollWidth,
		});
	}

	/**
	 * @description Init current calendar
	 * @private
	 */
	public initCurrentCalendar() {
		const currentCalendarRef = this.calendarsRef.find((calendarRef) => {
			return calendarRef.preferences().from.toISOString() === this.currentDate().toISOString();
		});
		if (currentCalendarRef) {
			this.currentCalendarRef = currentCalendarRef;
		}
		this.scrollToCalendar(this.currentCalendarRef);
	}

	/**
	 * @description Scroll to current calendar
	 * @private
	 */
	public scrollToCalendar(calendarRef: ColumnsBlockComponent | undefined | null) {

		if (!calendarRef) {
			return;
		}

		const hoursComponentNativeElement: HTMLElement = this.hoursComponentRef.elementRef.nativeElement;
		const left = calendarRef.elementRef.nativeElement.offsetLeft - hoursComponentNativeElement.offsetWidth;
		const top = (this.hoursComponentRef.elementRef.nativeElement?.offsetTop ?? 0) - (this.hoursComponentRef.elementRef.nativeElement?.offsetHeight ?? 0);
		const scrollToOptions: ScrollToOptions = {
			left,
			top,
		};

		this.elementRef.nativeElement.scrollTo(scrollToOptions);

	}

}
