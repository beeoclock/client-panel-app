import {AfterViewInit, Component, HostBinding, inject, Input, ViewEncapsulation} from "@angular/core";
import {CellComponent} from "@event/presentation/page/calendar-with-specialists/component/cell/cell.component";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {TimeLineComponent} from "@event/presentation/page/calendar-with-specialists/component/time-line.component";
import * as Member from "@member/domain";
import {
	DateControlCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/date-control/date-control.calendar-with-specialists.service";
import {
	EventCardComponent
} from "@event/presentation/page/calendar-with-specialists/component/event-card/event-card.component";
import {TableState_BackendFormat} from "@utility/domain/table.state";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {DateTime} from "luxon";
import {ListMergedEventApiAdapter} from "@event/adapter/external/api/list.merged.event.api.adapter";

@Component({
	selector: 'event-data-frame-component',
	template: `

		<ng-container *ngFor="let event of events;">
			<event-card-component
				*ngFor="let card of event.cards;"
				[card]="card"
				[event]="event"
				[slotInMinutes]="slotInMinutes"
				[stepPerHour]="stepPerHour"
				[startTimeToDisplay]="startTimeToDisplay"/>
		</ng-container>

	`,
	standalone: true,
	imports: [
		CellComponent,
		NgForOf,
		NgIf,
		TimeLineComponent,
		EventCardComponent,
		NgStyle
	],
	encapsulation: ViewEncapsulation.None
})
export class DataFrameComponent implements AfterViewInit {

	@Input()
	public rows!: {
		isFirstOrLastRowOfHour: boolean;
	}[];

	@Input()
	public columnHeaderList!: {
		member: Member.RIMember | null;
	}[];

	@Input()
	public stepPerHour!: number;

	@Input()
	public slotInMinutes!: number;

	@Input()
	public heightInPx!: number;

	@Input()
	public heightPerSlotInPx!: number;

	@Input()
	public headerHeightInPx!: number;

	@Input()
	public startTimeToDisplay!: number;

	@Input()
	public endTimeToDisplay!: number;

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

	public events: {
		cards: {
			startTime: number;
			durationInMinutes: number;
			column: number;
		}[];
		title: string;
		description: string;
	}[] = [];

	private readonly dateControlCalendarWithSpecialistsService = inject(DateControlCalendarWithSpecialistsService);
	private readonly listMergedEventApiAdapter = inject(ListMergedEventApiAdapter);

	public ngAfterViewInit() {

		this.dateControlCalendarWithSpecialistsService.selectedDate$.subscribe((selectedDate) => {

			const params: TableState_BackendFormat = {
				start: selectedDate.startOf('day').toJSDate().toISOString(),
				end: selectedDate.endOf('day').toJSDate().toISOString(),
				page: 1,
				pageSize: 1000,
				orderBy: OrderByEnum.CREATED_AT,
				orderDir: OrderDirEnum.DESC,
			};

			this.listMergedEventApiAdapter.execute$(params).subscribe((result) => {
				console.log(result);

				this.events = [];

				result.items.forEach((item) => {
					this.events.push({
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
					});
				});

				this.events = this.events.filter((event) => {
					return event.cards.every((card) => {
						return card.startTime >= this.startTimeToDisplay && card.startTime <= this.endTimeToDisplay;
					});
				});

			});

		});

	}

}
