import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	inject,
	input,
	QueryList,
	ViewChildren,
	ViewEncapsulation
} from "@angular/core";
import {RISchedule} from "@shared/domain/interface/i.schedule";
import {
	CalendarWithSpecialistsQueries
} from "@tenant/event/infrastructure/state/calendar-with-specialists/calendar–with-specialists.queries";
import {DateTime} from "luxon";
import {Store} from "@ngxs/store";
import {filter, map, switchMap} from "rxjs";
import {Reactive} from "@core/cdk/reactive";
import CalendarWithSpecialistLocaStateService
	from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/calendar-with-specialist.loca.state.service";
import {BooleanState} from "@shared/domain";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {IMember} from "@tenant/member/member/domain/interface/i.member";


interface IData {
	start: string;
	end: string;
	isBusinessSchedule: boolean;
	isMemberSchedule: boolean;
	style: {
		top: number; // in px
		height: number; // in px
	}
}

@Component({
	standalone: true,
	selector: 'app-schedule-element-calendar-with-specialist-widget-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	template: `
		@for (elementData of dataToBuildScheduleElements; track elementData.start) {

			<div
				#scheduleElement
				class="absolute bg-white w-full overflow-hidden"
				[style.z-index]="1"
				[attr.data-start]="elementData.start"
				[attr.data-end]="elementData.end"
				[attr.data-is-business-schedule]="elementData.isBusinessSchedule"
				[attr.data-is-member-schedule]="elementData.isMemberSchedule"
				[style.height.px]="elementData.style.height"
				[style.top.px]="elementData.style.top">
				<ng-content/>

			</div>

		}
	`
})
export class ScheduleElementCalendarWithSpecialistWidgetComponent extends Reactive implements AfterViewInit {

	public readonly member = input<IMember.EntityRaw | null>(null);

	public readonly index = input<number>(-1); // Index of instance

	public readonly calendar = input<HTMLDivElement | null>(null);

	@ViewChildren('scheduleElement')
	public scheduleElements!: QueryList<ElementRef<HTMLDivElement>>;

	public readonly dataToBuildScheduleElements: IData[] = [];

	public selectedDate: DateTime = DateTime.now();

	private readonly calendarWithSpecialistLocaStateService = inject(CalendarWithSpecialistLocaStateService);
	private readonly store = inject(Store);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	private readonly scrollInitialized = new BooleanState(false);

	public readonly schedulesForSelectedDate$ = this.store.select(CalendarWithSpecialistsQueries.start).pipe(
		filter(DateTime.isDateTime),
		switchMap(selectedDate => {
			this.selectedDate = selectedDate;
			this.scrollInitialized.switchOff();
			return this.store.select(BusinessProfileState.schedules).pipe(
				filter(Array.isArray),
				map((schedules: RISchedule[]) =>
					schedules.filter(
						({workDays}) => workDays.includes(selectedDate.weekday)
					)
				)
			)
		}),
	);

	public ngAfterViewInit() {

		const index = this.index();
		if (index === 0) {

			this.scheduleElements.changes.pipe(
				this.takeUntil(),
			).subscribe((scheduleElements: QueryList<ElementRef<HTMLDivElement>>) => {

				if (this.scrollInitialized.isOn) {
					return;
				}
				this.scrollInitialized.switchOn();

				this.calendar()?.scrollTo({
					top: (scheduleElements?.first?.nativeElement?.offsetTop ?? 0) - this.calendarWithSpecialistLocaStateService.specialistCellHeightForPx,
				})

			});

		}

		this.schedulesForSelectedDate$.pipe(
			this.takeUntil(),
		).subscribe((schedules) => {
			this.dataToBuildScheduleElements.length = 0;
			schedules.forEach(schedule => {
				const start = this.selectedDate.startOf('day').set({second: schedule.startInSeconds});
				const end = this.selectedDate.startOf('day').set({second: schedule.endInSeconds});

				let top = this.calendarWithSpecialistLocaStateService.specialistCellHeightForPx;
				top += (start.hour * this.calendarWithSpecialistLocaStateService.oneHourForPx);
				top += (start.minute * this.calendarWithSpecialistLocaStateService.oneMinuteForPx);

				const height = (end.hour - start.hour) * this.calendarWithSpecialistLocaStateService.oneHourForPx;

				this.dataToBuildScheduleElements.push({
					start: start.toJSDate().toISOString(),
					end: end.toJSDate().toISOString(),
					isBusinessSchedule: true,
					isMemberSchedule: false,
					style: {
						top,
						height
					}
				});
			});
			this.changeDetectorRef.detectChanges();
		});

	}

}
