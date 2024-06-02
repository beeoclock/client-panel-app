import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    OnInit,
    QueryList,
    ViewChildren,
    ViewEncapsulation
} from "@angular/core";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {AutoRefreshComponent} from "@utility/presentation/component/auto-refresh/auto-refresh.component";
import {
    DateControlCalendarWithSpecialistsComponent
} from "@page/event/calendar-with-specialists/component/filter/date-control/date-control.calendar-with-specialists.component";
import {
    EventCalendarWithSpecialistWidgetComponent
} from "@page/event/calendar-with-specialists/v2/component/event.calendar-with-specialist.widget.component";
import {
    CalendarWithSpecialistLocaStateService
} from "@page/event/calendar-with-specialists/v2/calendar-with-specialist.loca.state.service";
import {Reactive} from "@utility/cdk/reactive";
import {NGXLogger} from "ngx-logger";
import {
    HeaderCalendarWithSpecialistWidgetComponent
} from "@page/event/calendar-with-specialists/v2/component/header.calendar-with-specialist.widget.component";
import {firstValueFrom, map} from "rxjs";
import {IEvent_V2} from "@event/domain";
import {CalendarWithSpecialistsQueries} from "@event/state/calendar-with-specialists/calendar–with-specialists.queries";
import {Store} from "@ngxs/store";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";
import {ActivatedRoute} from "@angular/router";
import {CalendarWithSpecialistsAction} from "@event/state/calendar-with-specialists/calendar-with-specialists.action";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AdditionalMenuComponent} from "@event/presentation/component/additional-menu/additional-menu.component";
import {RIMember} from "@member/domain";
import {PushBoxService} from "@utility/presentation/component/push-box/push-box.service";

@Component({
    selector: 'app-calendar-with-specialists-widget-component',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="h-[50px] flex gap-4 px-2 items-center bg-white border-b border-beeColor-200">
            <event-date-control-calendar-with-specialists-component/>
            <utility-auto-refresh-component (emitter)="forceRefresh()" [isLoading]="(loader$ | async) ?? false"/>
        </div>
        <!-- Grid of hour rows -->
        <div class="flex relative overflow-auto bg-white h-[calc(100vh-114px)] md:h-[calc(100vh-50px)]">
            <div class="bg-white border-r flex flex-col left-0 sticky z-10" data-is-column="true"
                 [style.width]="calendarWithSpecialistLocaStateService.hoursWidthInPx"
                 [style.min-height]="calendarWithSpecialistLocaStateService.columnHeightInPx">
                <div [style.min-height]="calendarWithSpecialistLocaStateService.specialistCellHeightInPx"
                     class="z-10 bg-white sticky top-0 border-b">
                </div>
                <div class="border-b text-slate-400 text-right px-2 sticky left-0"
                     [style.min-height]="calendarWithSpecialistLocaStateService.oneHourInPx"
                     *ngFor="let hourRow of calendarWithSpecialistLocaStateService.hourRowListInPx">
                    {{ hourRow.hour }}
                </div>
            </div>
            <div
                    *ngFor="let member of calendarWithSpecialistLocaStateService.members; let index = index;"
                    #column
                    (mouseover)="mouseover($event)"
                    (mouseenter)="mouseEnter($event)"
                    (touchstart)="mouseover($event)"
                    (touchend)="mouseEnter($event)"
                    [attr.data-index]="index + 1"
                    class="flex flex-col border-r relative" data-is-column="true"
                    [style.width]="calendarWithSpecialistLocaStateService.cellWidthInPx"
                    [style.min-width]="calendarWithSpecialistLocaStateService.cellWidthInPx"
                    [style.max-width]="calendarWithSpecialistLocaStateService.cellWidthInPx"
                    [style.min-height]="calendarWithSpecialistLocaStateService.columnHeightInPx">
                <div [style.min-height]="calendarWithSpecialistLocaStateService.specialistCellHeightInPx"
                     class="z-10 p-1 bg-white sticky top-0 border-b">

                    <event-header-calendar-with-specialist-widget-component [member]="member"/>

                </div>
                <div class="border-b"
                     [attr.data-column-index]="index + 1"
                     [style.min-height]="calendarWithSpecialistLocaStateService.oneHourInPx"
                     *ngFor="let hourRow of calendarWithSpecialistLocaStateService.hourRowListInPx">

                    <div (click)="openAdditionalMenu(hourRow.original, member)"
                         class="active:bg-blue-400 active:text-white bg-neutral-100 border-2 border-[#00000038] cursor-pointer flex h-full hover:opacity-100 items-center opacity-0 px-2 rounded-md text-neutral-500 transition-all">
                        + {{ 'keyword.capitalize.add-event' | translate }}
                    </div>
                </div>
                <ng-container *ngIf="eventsBySpecialistId[member._id] as events">
                    <app-event-calendar-with-specialists-widget-component *ngFor="let event of events" [item]="event"/>
                </ng-container>
            </div>
        </div>
    `,
    imports: [
        NgForOf,
        AsyncPipe,
        AutoRefreshComponent,
        DateControlCalendarWithSpecialistsComponent,
        NgIf,
        EventCalendarWithSpecialistWidgetComponent,
        HeaderCalendarWithSpecialistWidgetComponent,
        TranslateModule
    ]
})
export class CalendarWithSpecialistWidgetComponent extends Reactive implements OnInit, AfterViewInit {

    public changeEventPositionIsOn = false;

    public readonly calendarWithSpecialistLocaStateService = inject(CalendarWithSpecialistLocaStateService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private readonly pushBoxService = inject(PushBoxService);
    private readonly translateService = inject(TranslateService);
    private readonly ngxLogger = inject(NGXLogger);
    private readonly store = inject(Store);
    private readonly activatedRoute = inject(ActivatedRoute);

    public eventsBySpecialistId: { [key: string]: IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; } | IAbsenceDto>[] } = {};

    private readonly events$ = this.store.select(CalendarWithSpecialistsQueries.data).pipe(
        this.takeUntil(),
        map((items) => {

            return items.reduce((acc, event) => {

                const {attendees, entireBusiness} = event;

                if (entireBusiness) {

                    this.calendarWithSpecialistLocaStateService.members.forEach((member) => {

                        const {_id: specialistId} = member;

                        acc[specialistId] = acc[specialistId] || [];

                        acc[specialistId].push(structuredClone(event));

                    });

                } else {

                    attendees.forEach((attendee) => {

                        if (attendee.is !== 'specialist') {
                            return;
                        }

                        const specialistId = attendee._id as string;

                        acc[specialistId] = acc[specialistId] || [];

                        // Push event into specialist's list and filter out other specialists but keep customers
                        acc[specialistId].push(structuredClone({
                            ...event,
                            attendees: event.attendees.filter((attendee) => {
                                if (attendee.is === 'specialist') {
                                    return attendee._id === specialistId;
                                }
                                return true;
                            })
                        }));

                    });

                }

                return acc;

            }, {} as { [key: string]: IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; } | IAbsenceDto>[] });

        }),
    );

    public readonly selectedDate$ = this.store.select(CalendarWithSpecialistsQueries.start);
    public readonly loader$ = this.store.select(CalendarWithSpecialistsQueries.loader);

    public ngOnInit() {

        this.detectDateInQueryParams();
        this.calendarWithSpecialistLocaStateService.eventCalendarWithSpecialistWidgetComponent$.pipe(
            this.takeUntil()
        ).subscribe((eventCalendarWithSpecialistWidgetComponent) => {
            this.initListenersFor(eventCalendarWithSpecialistWidgetComponent);
        });
        this.events$.pipe(this.takeUntil()).subscribe((eventsBySpecialistId) => {

            this.eventsBySpecialistId = eventsBySpecialistId;
            setTimeout(() => {
                this.columnList.forEach((column) => {
                    this.findAndFixNearEventsWidthInEachColumn(column);
                });
            }, 0);
        });

    }

    public ngAfterViewInit() {

        this.columnList.changes.pipe(
            this.takeUntil()
        ).subscribe((columnList: ElementRef<HTMLDivElement>[]) => {
            columnList.forEach((column) => {
                this.findAndFixNearEventsWidthInEachColumn(column);
            });
        });
    }

    public async forceRefresh() {

        this.store.dispatch(new CalendarWithSpecialistsAction.GetItems());

    }

    private detectDateInQueryParams() {
        const {date} = this.activatedRoute.snapshot.queryParams;

        if (!date) {
            this.forceRefresh().then();
            return;
        }

        this.store.dispatch(new CalendarWithSpecialistsAction.SetDate({
            date
        }));
    }


    // Find all #column
    @ViewChildren('column')
    public columnList!: QueryList<ElementRef<HTMLDivElement>>;

    private eventCalendarWithSpecialistWidgetComponent: EventCalendarWithSpecialistWidgetComponent | null = null;

    public initListenersFor(eventCalendarWithSpecialistWidgetComponent: EventCalendarWithSpecialistWidgetComponent | null) {
        this.ngxLogger.info('initListenersFor: ', eventCalendarWithSpecialistWidgetComponent);

        if (!eventCalendarWithSpecialistWidgetComponent) {
            // TODO: cancel all listeners
            return;
        }

        this.eventCalendarWithSpecialistWidgetComponent = eventCalendarWithSpecialistWidgetComponent;

        this.changeDetectorRef.detectChanges();

        let mouseDown = false;
        let prevMousePosition = {x: 0, y: 0};
        let whatIsDragging: 'position' | 'top' | 'bottom' | null = null;
        const mutatedOtherEventHtmlList: HTMLDivElement[] = [];

        const mouseDownListener = (event: MouseEvent | undefined) => {

            if (!event) {
                return;
            }

            const {target} = event as unknown as MouseEvent & { target: HTMLElement }

            if (!target) {
                return;
            }

            whatIsDragging = (target.dataset.dragging ?? null) as 'position' | 'top' | 'bottom' | null;
            console.log('mouseMoveListener: ', event, whatIsDragging);

            if (whatIsDragging === null) {
                return;
            }

            mouseDown = true;
            prevMousePosition = {x: event.clientX, y: event.clientY};
        };

        const mouseMoveListener = (event: MouseEvent | undefined, isMobile: boolean = false) => {
            if (mouseDown) {

                if (!event) {
                    return;
                }

                // Change vertical position of the event but mouse has another top position then the event should be included the difference


                // Step is to change height of the event is: 5 minutes what is equal to (120px/60px)*5 = 10px
                // So, user can't change height of the event less than 10px every step
                const diffY = event.clientY - prevMousePosition.y;

                // TODO: Implement this feature
                // if (Math.abs(diffY) < 10) {
                //     return;
                // }

                prevMousePosition = {x: event.clientX, y: event.clientY};

                const htmlDivElement = eventCalendarWithSpecialistWidgetComponent.elementRef.nativeElement;

                switch (whatIsDragging) {
                    case 'position': {

                        this.changeEventPositionIsOn = true;

                        const currentTop = htmlDivElement.offsetTop;
                        const newTop = currentTop + diffY;

                        // Check if new top position is not out of column + specialist cell height
                        if (newTop > this.calendarWithSpecialistLocaStateService.specialistCellHeightForPx) {
                            // Check of new top position is not out of the bottom of the column
                            // Get event height
                            const eventHeight = htmlDivElement.clientHeight;
                            // Check if new top position is not out of the bottom of the column
                            if ((newTop + eventHeight) <= this.calendarWithSpecialistLocaStateService.columnHeightForPx) {
                                htmlDivElement.style.top = `${newTop}px`;
                            }
                        }

                        break;
                    }
                    case 'top': {

                        // Change height of the event and top position
                        const currentTop = htmlDivElement.offsetTop;
                        const newTop = currentTop + diffY;
                        const currentHeight = htmlDivElement.clientHeight;
                        const newHeight = currentHeight - diffY;

                        // Check if new top position is not out of column + specialist cell height
                        if (newTop > this.calendarWithSpecialistLocaStateService.specialistCellHeightForPx) {
                            // Check of new top position is not out of the bottom of the column
                            // Get event height
                            const eventHeight = htmlDivElement.clientHeight;
                            // Check if new top position is not out of the bottom of the column
                            if ((newTop + eventHeight) <= this.calendarWithSpecialistLocaStateService.columnHeightForPx) {
                                // Check if newTop is not out of bottom of the event
                                if (newTop <= (currentTop + currentHeight)) {
                                    htmlDivElement.style.top = `${newTop}px`;
                                    htmlDivElement.style.height = `${newHeight}px`;
                                }
                            }
                        }


                        break;
                    }
                    case 'bottom': {
                        // Change height of the event
                        const currentHeight = htmlDivElement.clientHeight;
                        const newHeight = currentHeight + diffY;

                        // Check of new top position is not out of the bottom of the column
                        // Check if new top position is not out of the bottom of the column
                        if ((newHeight + htmlDivElement.offsetTop) <= this.calendarWithSpecialistLocaStateService.columnHeightForPx) {
                            htmlDivElement.style.height = `${newHeight}px`;
                        }


                        break;
                    }
                }

                this.eventCalendarWithSpecialistWidgetComponent?.someUpdateFromExternal();

                // Detect if htmlDivElement is near to another htmlDivElement if yes then change width of the events

                // Check if htmlDivElement is near to another htmlDivElement
                const column = htmlDivElement.parentElement;
                if (!column) {
                    return;
                }

                if (isMobile) {
                    this.columnList.forEach((column) => {
                        // Find if event is now in other column
                        const rect = column.nativeElement.getBoundingClientRect();
                        if (event.clientX > rect.left && event.clientX < rect.right && event.clientY > rect.top && event.clientY < rect.bottom) {
                            const newIndex = column.nativeElement.dataset.index;
                            if (!newIndex) {
                                return;
                            }
                            column.nativeElement.appendChild(htmlDivElement);
                            this.eventCalendarWithSpecialistWidgetComponent?.changeMember(this.calendarWithSpecialistLocaStateService.members[Number(newIndex) - 1]);
                        }
                    });
                }

                const nearEvents = column.querySelectorAll('[data-is-event="true"]');

                console.log('nearEvents', nearEvents)

                const restoreWidthOfMutatedEvents = () => {
                    mutatedOtherEventHtmlList.forEach((element, index) => {
                        console.log('element', element, index, column.clientWidth, mutatedOtherEventHtmlList.length)
                        element.style.width = `${column.clientWidth / mutatedOtherEventHtmlList.length}px`;
                        element.style.transform = `translateX(calc(100% * ${index}))`;
                    });
                };

                if (!nearEvents.length || nearEvents.length === 1) {
                    htmlDivElement.style.width = '100%';
                    htmlDivElement.style.transform = `translateX(0)`;
                    restoreWidthOfMutatedEvents();
                    return;
                }

                const findNearEvents = Array.from(nearEvents).filter((element) => {
                    if (element === htmlDivElement) {
                        return false;
                    }
                    const elm = element as HTMLDivElement;
                    const rect = elm.getBoundingClientRect();
                    const rect2 = htmlDivElement.getBoundingClientRect();
                    return rect.top < rect2.bottom && rect.bottom > rect2.top;
                });

                console.log('findNearEvents', findNearEvents)

                if (!findNearEvents.length) {
                    htmlDivElement.style.width = '100%';
                    htmlDivElement.style.transform = `translateX(0)`;
                    restoreWidthOfMutatedEvents();
                    return;
                }

                const top = htmlDivElement.offsetTop;
                const htmlDivElementHasSmollerTop = findNearEvents.every((element) => {
                    const elm = element as HTMLDivElement;
                    return elm.offsetTop > top;
                });
                console.log('htmlDivElementHasSmollerTop', htmlDivElementHasSmollerTop)

                mutatedOtherEventHtmlList.length = 0;

                findNearEvents.forEach((element, index) => {
                    if (element === htmlDivElement) {
                        return;
                    }
                    const elm = element as HTMLDivElement;
                    mutatedOtherEventHtmlList.push(elm);
                    elm.style.width = `${column.clientWidth / (findNearEvents.length + 1)}px`;
                    elm.style.transform = `translateX(calc(100% * ${index + (htmlDivElementHasSmollerTop ? 1 : 0)}))`
                });

                htmlDivElement.style.width = `${column.clientWidth / (findNearEvents.length + 1)}px`;
                htmlDivElement.style.transform = `translateX(calc(100% * ${(htmlDivElementHasSmollerTop ? 0 : findNearEvents.length)}))`

            }
        }

        // For desktop
        const mouseUpListener = () => {
            this.ngxLogger.info('mouseUpListener: delete all listeners');
            mutatedOtherEventHtmlList.length = 0;

            mouseDown = false;
            this.changeEventPositionIsOn = false;
            this.eventCalendarWithSpecialistWidgetComponent?.toggleMode(false);

            prevMousePosition = {x: 0, y: 0};
            // Delete listeners
            document.removeEventListener('mousedown', mouseDownListener, false);
            document.removeEventListener('mouseup', mouseUpListener, false);
            document.removeEventListener('mousemove', mouseMoveListener, false);

            document.removeEventListener('touchstart', touchStartListener, false);
            document.removeEventListener('touchend', touchEndListener, false);
            document.removeEventListener('touchmove', touchMoveListener, false);

            this.changeDetectorRef.detectChanges();
        };

        document.addEventListener('mousedown', mouseDownListener, false);
        document.addEventListener('mouseup', mouseUpListener, false);
        document.addEventListener('mousemove', mouseMoveListener, false);

        // For mobile

        const touchStartListener = (event: TouchEvent) => {
            console.log('touchstart: ', event);
            mouseDownListener(event.touches[0] as unknown as MouseEvent);
            event.preventDefault();
            event.stopPropagation();
        };

        const touchEndListener = () => {
            console.log('touchend');
            mouseUpListener();
        };

        const touchMoveListener = (event: TouchEvent) => {
            console.log('touchmove: ', event);
            mouseMoveListener(event.touches[0] as unknown as MouseEvent, true);
            event.preventDefault();
            event.stopPropagation();
        };

        document.addEventListener('touchstart', touchStartListener, {passive: false});
        document.addEventListener('touchend', touchEndListener, {passive: false});
        document.addEventListener('touchmove', touchMoveListener, {passive: false});


    }


    mouseover($event: MouseEvent | TouchEvent) {
        const {target} = $event as unknown as MouseEvent & { target: HTMLElement }

        if (!target) {
            return;
        }

        if (!this.changeEventPositionIsOn) {
            return;
        }

        const htmlDivElement = this.eventCalendarWithSpecialistWidgetComponent?.elementRef?.nativeElement;

        if (!htmlDivElement) {
            return;
        }
        const columnIndex = target.dataset.index;

        if (!columnIndex) {
            return;
        }

        console.log('mouseover: ', $event, columnIndex, htmlDivElement.dataset.columnIndex, htmlDivElement.dataset.columnIndex === columnIndex);

        if (htmlDivElement.dataset.columnIndex === columnIndex) {
            return;
        }

        // Move event to another column
        // Move HTML element to another column

        const column = document.querySelector(`[data-index="${columnIndex}"]`);
        console.log('column', column, columnIndex)
        if (!column) {
            return;
        }
        column.appendChild(htmlDivElement);
        const index = Number(columnIndex) - 1;
        const member = this.calendarWithSpecialistLocaStateService.members[index];
        this.eventCalendarWithSpecialistWidgetComponent?.changeMember(member);

    }


    mouseEnter($event: MouseEvent | TouchEvent) {
        const {target} = $event as unknown as MouseEvent & { target: HTMLElement }

        if (!target) {
            return;
        }

        if (!this.changeEventPositionIsOn) {
            return;
        }

        const htmlDivElement = this.eventCalendarWithSpecialistWidgetComponent?.elementRef?.nativeElement;

        if (!htmlDivElement) {
            return;
        }
        const columnIndex = target.dataset.index;

        if (!columnIndex) {
            return;
        }

        console.log('mouseover: ', $event, columnIndex, htmlDivElement.dataset.columnIndex);

        if (htmlDivElement.dataset.columnIndex === columnIndex) {
            return;
        }

        // Move event to another column
        // Move HTML element to another column

        const column = document.querySelector(`[data-index="${columnIndex}"]`);
        if (!column) {
            return;
        }
        column.appendChild(htmlDivElement);
        // Change data-column-index attribute
        if (this.eventCalendarWithSpecialistWidgetComponent) {

            const index = Number(columnIndex) - 1;
            const member = this.calendarWithSpecialistLocaStateService.members[index];
            this.eventCalendarWithSpecialistWidgetComponent?.changeMember(member);

        }
    }

    public findAndFixNearEventsWidthInEachColumn(column: ElementRef<HTMLDivElement>) {

        const columnElement = column.nativeElement;

        const events = columnElement.querySelectorAll('[data-is-event="true"]');

        if (!events.length) {
            return;
        }

        const eventsArray = Array.from(events);

        eventsArray.forEach((event) => {

            const eventElement = event as HTMLDivElement;

            const rect = eventElement.getBoundingClientRect();

            const nearEvents = eventsArray.filter((element) => {
                if (element === eventElement) {
                    return false;
                }
                const elm = element as HTMLDivElement;
                const rect2 = elm.getBoundingClientRect();
                return rect.top < rect2.bottom && rect.bottom > rect2.top;
            });

            if (!nearEvents.length) {
                eventElement.style.width = '100%';
                eventElement.style.transform = `translateX(0)`;
                return;
            }

            const top = eventElement.offsetTop;
            const eventHasSmollerTop = nearEvents.every((element) => {
                const elm = element as HTMLDivElement;
                return elm.offsetTop > top;
            });

            nearEvents.forEach((element, index) => {
                if (element === eventElement) {
                    return;
                }
                const elm = element as HTMLDivElement;
                elm.style.width = `${columnElement.clientWidth / (nearEvents.length + 1)}px`;
                elm.style.transform = `translateX(calc(100% * ${index + (eventHasSmollerTop ? 1 : 0)}))`
            });

            eventElement.style.width = `${columnElement.clientWidth / (nearEvents.length + 1)}px`;
            eventElement.style.transform = `translateX(calc(100% * ${(eventHasSmollerTop ? 0 : nearEvents.length)}))`

        });

        this.changeDetectorRef.detectChanges();

    }

    public async openAdditionalMenu(hour: number, member: RIMember) {

        const title = this.translateService.instant('event.additionalMenu.title');

        const selectedDate = await firstValueFrom(this.selectedDate$);

        this.ngxLogger.debug('openAdditionalMenu:selectedDate', selectedDate);

        const callback = () => {
            this.ngxLogger.debug('Callback');
            this.store.dispatch(new CalendarWithSpecialistsAction.GetItems());
        };

        const datetimeISO = selectedDate
            .startOf('day')
            .plus({
                hours: hour,
            })
            .toJSDate()
            .toISOString();

        await this.pushBoxService.buildItAsync({
            component: AdditionalMenuComponent,
            title,
            componentInputs: {
                datetimeISO,
                member,
                callback
            }
        });

    }

}
