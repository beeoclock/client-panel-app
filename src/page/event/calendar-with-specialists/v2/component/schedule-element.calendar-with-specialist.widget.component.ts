import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	Input,
	OnInit,
	ViewEncapsulation
} from "@angular/core";
import {RIMember} from "@member/domain";
import {ClientState} from "@client/state/client/client.state";
import {RISchedule} from "@utility/domain/interface/i.schedule";
import {CalendarWithSpecialistsQueries} from "@event/state/calendar-with-specialists/calendar–with-specialists.queries";
import {DateTime} from "luxon";
import {Store} from "@ngxs/store";
import {filter, map, switchMap} from "rxjs";
import {Reactive} from "@utility/cdk/reactive";
import {NgForOf} from "@angular/common";
import {
	CalendarWithSpecialistLocaStateService
} from "@page/event/calendar-with-specialists/v2/calendar-with-specialist.loca.state.service";

@Component({
	standalone: true,
	selector: 'app-schedule-element-calendar-with-specialist-widget-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgForOf
	],
	template: `
		<div
			class="absolute bg-white w-full"
			[style.z-index]="1"
			*ngFor="let elementData of dataToBuildScheduleElements"
			[attr.data-start]="elementData.start"
			[attr.data-end]="elementData.end"
			[attr.data-is-business-schedule]="elementData.isBusinessSchedule"
			[attr.data-is-member-schedule]="elementData.isMemberSchedule"
			[style.height.px]="elementData.style.height"
			[style.top.px]="elementData.style.top">
			<ng-content/>

		</div>
	`
})
export class ScheduleElementCalendarWithSpecialistWidgetComponent extends Reactive implements OnInit {

	@Input()
	public member: RIMember | null = null;

	public dataToBuildScheduleElements: {
		start: string;
		end: string;
		isBusinessSchedule: boolean;
		isMemberSchedule: boolean;
		style: {
			top: number; // in px
			height: number; // in px
		}
	}[] = [];

	public selectedDate: DateTime = DateTime.now();

	private readonly calendarWithSpecialistLocaStateService = inject(CalendarWithSpecialistLocaStateService);
	private readonly store = inject(Store);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	public readonly schedulesForSelectedDate$ = this.store.select(CalendarWithSpecialistsQueries.start).pipe(
		filter(DateTime.isDateTime),
		switchMap(selectedDate => {
			this.selectedDate = selectedDate;
			return this.store.select(ClientState.schedules).pipe(
				filter(Array.isArray),
				map((schedules: RISchedule[]) =>
					schedules.filter(
						({workDays}) => workDays.includes(selectedDate.weekday)
					)
				)
			)
		}),
	);

	public ngOnInit() {
		this.schedulesForSelectedDate$.pipe(
			this.takeUntil(),
		).subscribe((schedules) => {
			schedules.forEach(schedule => {
				console.log(schedule);
				const start = this.selectedDate.startOf('day').plus({seconds: schedule.startInSeconds});
				const end = this.selectedDate.startOf('day').plus({seconds: schedule.endInSeconds});

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
