import {ChangeDetectionStrategy, Component, HostBinding, inject, Input, ViewEncapsulation} from "@angular/core";
import {CellComponent} from "@event/presentation/page/calendar-with-specialists/component/cell/cell.component";
import {AsyncPipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {TimeLineComponent} from "@event/presentation/page/calendar-with-specialists/component/time-line.component";
import * as Member from "@member/domain";
import {DateTime} from "luxon";
import {map, Observable} from "rxjs";
import {
	ComposeCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.service";
import {RIEvent} from "@event/domain";
import {Reactive} from "@utility/cdk/reactive";
import {Store} from "@ngxs/store";
import {CalendarWithSpecialistsQueries} from "@event/state/calendar-with-specialists/calendar–with-specialists.queries";
import {
	GroupEventCardComponent
} from "@event/presentation/page/calendar-with-specialists/component/container/data-frame/event-card/group-event-card.component";
import {
	EventCardComponent
} from "@event/presentation/page/calendar-with-specialists/component/container/data-frame/event-card/event-card.component";
import {
	groupOverlappingEvents
} from "@event/presentation/page/calendar-with-specialists/component/container/data-frame/eventUtils";

@Component({
	selector: 'event-data-frame-component',
	template: `
		<ng-container *ngFor="let groupEvents of (groupEvents$ | async) ?? []">

			<ng-container *ngIf="groupEvents.length > 1; else DefaultEventPresentation">
				<group-event-card-component
					[groupEvents]="groupEvents"/>
			</ng-container>
			<ng-template #DefaultEventPresentation>
				<event-card-component
					*ngFor="let event of groupEvents; trackBy: trackById"
					[id]="event.data._id"
					[card]="event.card"
					[event]="event"/>
			</ng-template>
		</ng-container>
	`,
	standalone: true,
	imports: [
		CellComponent,
		NgForOf,
		NgIf,
		TimeLineComponent,
		NgStyle,
		AsyncPipe,
		EventCardComponent,
		GroupEventCardComponent,
		EventCardComponent
	],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataFrameComponent extends Reactive {

	@Input()
	public rows!: {
		isFirstOrLastRowOfHour: boolean;
	}[];

	@Input()
	public columnHeaderList!: {
		member: Member.RIMember | null;
	}[];

	@HostBinding()
	public get class() {
		return 'grid absolute top-0 left-0 h-full';
	}

	@HostBinding('style.grid-template-rows')
	public get gridTemplateRows() {
		return `repeat(${this.rows.length}, ${this.heightPerSlotInPx}px)`;
	}

	@HostBinding('style.grid-template-columns')
	public get gridTemplateColumns() {
		return `repeat(${this.columnHeaderList.length - 1}, minmax(100px,200px))`;
	}

	@HostBinding('style.padding-top')
	public get paddingTop() {
		return `${this.headerHeightInPx}px`;
	}

	@HostBinding('style.padding-left')
	public get paddingLeft() {
		return `70px`;
	}

	private readonly composeCalendarWithSpecialistsService = inject(ComposeCalendarWithSpecialistsService);
	private readonly store = inject(Store);

	public readonly heightPerSlotInPx = this.composeCalendarWithSpecialistsService.heightPerSlotInPx;
	public readonly headerHeightInPx = this.composeCalendarWithSpecialistsService.headerHeightInPx;
	public readonly startTimeToDisplay = this.composeCalendarWithSpecialistsService.startTimeToDisplay;
	public readonly endTimeToDisplay = this.composeCalendarWithSpecialistsService.endTimeToDisplay;

	public readonly groupEvents$: Observable<{
		card: {
			startTime: number;
			durationInMinutes: number;
			column: number;
		};
		data: RIEvent;
	}[][]> = this.store.select(CalendarWithSpecialistsQueries.data).pipe(
		this.takeUntil(),
		map(({items}) => items),
		map((items) => {
			return [...items].sort((a, b) => {
				return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
			});
		}), // Sort by updatedAt
		map((items) => {
			return items.reduce((acc, item) => {
				const specialistId = item.services[0].specialists[0].member?._id;
				if (!specialistId) {
					return acc;
				}
				acc[specialistId] = acc[specialistId] || [];
				acc[specialistId].push(item);
				return acc;
			}, {} as {[key: string]: RIEvent[]});
		}),
		map((items) => Object.values(structuredClone(items)).map(groupOverlappingEvents<RIEvent[]>).flat()),
		map((group) => {
			console.log(group)
			return group.map((items) => {
				console.log(items)
				return items.map((item) => {
					console.log(item)
					const column = this.columnHeaderList.findIndex((column) => {
						return column.member?._id === item?.services?.[0]?.specialists?.[0]?.member?._id;
					});
					const start = DateTime.fromISO(item.start).toLocal();
					return {
						data: item,
						card: {
							startTime: start.hour + (start.minute / 60),
							durationInMinutes: item.services[0].durationVersions[0].durationInSeconds / 60,
							column,
						}
					};
				}).filter(({card}) => {
					return card.startTime >= this.startTimeToDisplay && card.startTime <= this.endTimeToDisplay;
				});
			});
		}),
	);

	public trackById(index: number, event: { data: RIEvent }) {
		return event.data._id;
	}

}
