import {ChangeDetectionStrategy, Component, HostBinding, inject, Input, ViewEncapsulation} from "@angular/core";
import {CellComponent} from "@event/presentation/page/calendar-with-specialists/component/cell/cell.component";
import {AsyncPipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {TimeLineComponent} from "@event/presentation/page/calendar-with-specialists/component/time-line.component";
import * as Member from "@member/domain";
import {DateTime} from "luxon";
import {map, Observable} from "rxjs";
import {
	EventCardComponent
} from "@event/presentation/page/calendar-with-specialists/component/event-card/event-card.component";
import {
	ComposeCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.service";
import {RIEvent} from "@event/domain";
import {Reactive} from "@utility/cdk/reactive";
import {Store} from "@ngxs/store";
import {CalendarWithSpecialistsQueries} from "@event/state/calendar-with-specialists/calendar–with-specialists.queries";

@Component({
	selector: 'event-data-frame-component',
	template: `
		<ng-container *ngFor="let event of (events$ | async) ?? [];">
			<event-card-component
				*ngFor="let card of event.cards;"
				[id]="event.data._id"
				[card]="card"
				[event]="event"/>
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

	public readonly events$: Observable<{
		cards: {
			startTime: number;
			durationInMinutes: number;
			column: number;
		}[];
		data: RIEvent;
	}[]> = this.store.select(CalendarWithSpecialistsQueries.data).pipe(
		this.takeUntil(),
		map(({items}) => {
			return items.map((item) => {
				const column = this.columnHeaderList.findIndex((column) => {
					return column.member?._id === item?.services?.[0]?.specialists?.[0]?.member?._id;
				});
				const start = DateTime.fromISO(item.start).toLocal();
				return {
					data: item,
					cards: [
						{
							startTime: start.hour + (start.minute / 60),
							durationInMinutes: item.services[0].durationVersions[0].durationInSeconds / 60,
							column,
						}
					]
				};
			}).filter((event) => {
				return event.cards.every((card) => {
					return card.startTime >= this.startTimeToDisplay && card.startTime <= this.endTimeToDisplay;
				});
			});
		})
	);

}
