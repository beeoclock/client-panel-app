import {ChangeDetectionStrategy, Component, HostBinding, inject, Input, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import * as Member from "@member/domain";
import {DateTime} from "luxon";
import {map, Observable} from "rxjs";
import {IEvent_V2} from "@event/domain";
import {Reactive} from "@utility/cdk/reactive";
import {Store} from "@ngxs/store";
import {CalendarWithSpecialistsQueries} from "@event/state/calendar-with-specialists/calendar–with-specialists.queries";
import {
    OrderEventCardComponent
} from "@page/event/calendar-with-specialists/component/container/data-frame/event-card/order-event-card.component";
import {
    GroupEventCardComponent
} from "@page/event/calendar-with-specialists/component/container/data-frame/event-card/group-event-card.component";
import {
    ComposeCalendarWithSpecialistsService
} from "@page/event/calendar-with-specialists/component/compose.calendar-with-specialists.service";
import {groupOverlappingEvents} from "@page/event/calendar-with-specialists/component/container/data-frame/eventUtils";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {
    AbsenceEventCardComponent
} from "@page/event/calendar-with-specialists/component/container/data-frame/event-card/absence-event-card.component";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";

@Component({
    selector: 'event-data-frame-component',
    template: `
        <ng-container *ngFor="let groupEvents of (groupEvents$ | async) ?? []">
            <ng-container *ngIf="groupEvents.length > 1; else DefaultEventPresentation">
                <group-event-card-component
                        [groupEvents]="groupEvents"/>
            </ng-container>
            <ng-template #DefaultEventPresentation>
                <ng-container *ngFor="let event of groupEvents; trackBy: trackById">
                    <ng-container *ngIf="isOrder(event); else AbsenceTemplate">

                        <order-event-card-component
                                [id]="event.data._id"
                                [card]="event.card"
                                [event]="event"/>

                    </ng-container>
                    <ng-template #AbsenceTemplate>
                        <ng-container *ngIf="isAbsence(event); else UnknownTemplate">
                            <absence-event-card-component
                                    [id]="event.data._id"
                                    [card]="event.card"
                                    [event]="event"/>
                        </ng-container>
                    </ng-template>
                    <ng-template #UnknownTemplate>
                        <!--            Unknown            -->
                    </ng-template>
                </ng-container>
            </ng-template>
        </ng-container>
    `,
    standalone: true,
    imports: [
        NgForOf,
        NgIf,
        NgStyle,
        AsyncPipe,
        OrderEventCardComponent,
        GroupEventCardComponent,
        AbsenceEventCardComponent
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
        data: IEvent_V2;
    }[][]> = this.store.select(CalendarWithSpecialistsQueries.data).pipe(
        this.takeUntil(),
        map((items) => {

            return [...items].sort((a, b) => {

                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();

            });

        }), // Sort by updatedAt
        map((items) => {

            return items.reduce((acc, event) => {

                const {attendees, entireBusiness} = event;

                if (entireBusiness) {

                    this.columnHeaderList.forEach((column) => {

                        if (!column.member) {
                            return;
                        }

                        const {_id: specialistId} = column.member;

                        acc[specialistId] = acc[specialistId] || [];

                        acc[specialistId].push(event);

                    });

                } else {

                    attendees.forEach((attendee) => {

                        if (attendee.is !== 'specialist') {
                            return;
                        }

                        const specialistId = attendee._id as string;

                        acc[specialistId] = acc[specialistId] || [];

                        // Push event into specialist's list and filter out other specialists but keep customers
                        acc[specialistId].push({
                            ...event,
                            attendees: event.attendees.filter((attendee) => {
                                if (attendee.is === 'specialist') {
                                    return attendee._id === specialistId;
                                }
                                return true;
                            })
                        });

                    });

                }

                return acc;

            }, {} as { [key: string]: IEvent_V2[] });

        }),
        map((items) => Object.values(items).map(groupOverlappingEvents<IEvent_V2[]>).flat()),
        map((group: IEvent_V2[][]) => {

            return group.map((items) => {

                return items.map((item) => {

                    const specialist = item?.attendees?.find((attendee) => attendee.is === 'specialist');
                    const specialistId = specialist?._id;

                    const column = this.columnHeaderList.findIndex((column) => {

                        return column.member?._id === specialistId;

                    });

                    const start = DateTime.fromISO(item.start).toLocal();
                    let durationInMinutes = 0;

                    switch (item.is) {
                        case 'order':
                            const {
                                service: {
                                    serviceSnapshot: {
                                        durationVersions: {
                                            0: {
                                                durationInSeconds
                                            }
                                        }
                                    }
                                }
                            } = item.originalData as { order: IOrderDto; service: IOrderServiceDto; };
                            durationInMinutes = durationInSeconds / 60;
                            break;
                        case 'absence':
                            const end = DateTime.fromISO(item.end).toLocal();
                            durationInMinutes = end.diff(start, 'minutes').minutes;
                            break;
                    }

                    const startTime = (start.hour + (start.minute / 60));

                    return {
                        data: item,
                        card: {
                            startTime,
                            durationInMinutes,
                            column,
                        }
                    };

                }).filter(({card}) => {

                    return card.startTime >= this.startTimeToDisplay && card.startTime <= this.endTimeToDisplay;

                });

            });
        }),
    );

    public trackById(index: number, event: { data: IEvent_V2 }) {
        return event.data._id;
    }

    public isOrder(event: { data: IEvent_V2 }): event is {
        data: IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; }>;
        card: {
            startTime: number;
            durationInMinutes: number;
            column: number;
        };
    } {
        return event.data.is === 'order';
    }

    public isAbsence(event: { data: IEvent_V2 }): event is {
        data: IEvent_V2<IAbsenceDto>;
        card: {
            startTime: number;
            durationInMinutes: number;
            column: number;
        };
    } {
        return event.data.is === 'absence';
    }

}
