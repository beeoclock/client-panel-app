import {Component, HostBinding, inject, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {CellComponent} from "@event/presentation/page/calendar-with-specialists/component/cell/cell.component";
import {AsyncPipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {TimeLineComponent} from "@event/presentation/page/calendar-with-specialists/component/time-line.component";
import * as Member from "@member/domain";
import {DateTime} from "luxon";
import {FilterService} from "@event/presentation/page/calendar-with-specialists/component/filter/filter.service";
import {map, Observable} from "rxjs";
import {
	EventCardComponent
} from "@event/presentation/page/calendar-with-specialists/component/event-card/event-card.component";
import {
	ComposeCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.service";

@Component({
	selector: 'event-data-frame-component',
	template: `

		<ng-container *ngFor="let event of (events$ | async) ?? [];">
			<event-card-component
				*ngFor="let card of event.cards;"
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
	encapsulation: ViewEncapsulation.None
})
export class DataFrameComponent implements OnInit {

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
	private readonly filterService = inject(FilterService);

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
		title: string;
		description: string;
	}[]> = this.filterService.events$.pipe(
		map((events) => {
			return events.map((item) => {
				return {
					title: item.services[0].languageVersions[0].title,
					description: item.description,
					cards: [
						{
							startTime: DateTime.fromISO(item.start).toLocal().hour,
							durationInMinutes: item.services[0].durationVersions[0].durationInSeconds / 60,
							column: this.columnHeaderList.findIndex((column) => {
								return column.member?._id === item?.services?.[0]?.specialists?.[0]?.member?._id;
							}),
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

	public ngOnInit() {

		this.filterService.initHandler();

	}

}
