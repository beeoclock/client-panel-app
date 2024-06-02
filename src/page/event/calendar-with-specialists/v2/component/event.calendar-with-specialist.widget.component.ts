import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    inject,
    Input,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {NgIf} from "@angular/common";
import {
    CalendarWithSpecialistLocaStateService
} from "@page/event/calendar-with-specialists/v2/calendar-with-specialist.loca.state.service";
import {IEvent_V2} from "@event/domain";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";
import {
    OrderEventCalendarWithSpecialistWidgetComponent
} from "@page/event/calendar-with-specialists/v2/component/order-event.calendar-with-specialist.widget.component";
import {
    AbsenceEventCalendarWithSpecialistWidgetComponent
} from "@page/event/calendar-with-specialists/v2/component/absence-event.calendar-with-specialist.widget.component";
import {PopoverController} from "@ionic/angular";
import {
    PopoverMenuEventComponent
} from "@page/event/calendar-with-specialists/v2/component/popover-menu.event.component";
import {DateTime} from "luxon";

type DATA = IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; } | IAbsenceDto>;

@Component({
    selector: 'app-event-calendar-with-specialists-widget-component',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [
        NgIf,
        OrderEventCalendarWithSpecialistWidgetComponent,
        AbsenceEventCalendarWithSpecialistWidgetComponent
    ],
    template: `
        <app-order-event-calendar-with-specialist-widget-component *ngIf="isOrder(item)" [event]="item"/>
        <app-absence-event-calendar-with-specialist-widget-component *ngIf="isAbsence(item)" [event]="item"/>
        <ng-container *ngIf="draggable">
            <div data-dragging="position"
                 class="overflow-hidden absolute bg-black/50 bg-opacity-50 border-2 border-blue-500 bottom-0 left-0 p-1 right-0 rounded-md text-white top-0">
                Tap and hold to move
            </div>
            <div class="-top-1 absolute bg-blue-500 h-3 left-1/2 rounded-full w-3"
                 [style.transform]="'translate(-50%, 0)'">
            </div>
            <div data-dragging="top"
                 class="-top-2 w-full absolute bg-transparent h-5 left-0 right-0 rounded-full cursor-ns-resize">
            </div>
            <div class="-bottom-1 absolute bg-blue-500 h-3  left-1/2 rounded-full w-3"
                 [style.transform]="'translate(-50%, 0)'">
            </div>
            <div data-dragging="bottom"
                 class="-bottom-2 w-full absolute bg-transparent h-5 left-0 right-0 rounded-full cursor-ns-resize">
            </div>
        </ng-container>
    `
})
export class EventCalendarWithSpecialistWidgetComponent {

    @Input({required: true})
    public item!: DATA;

    @HostBinding()
    public get class() {
        return 'absolute';
    }

    @HostBinding('attr.data-is-event')
    public isEvent = true;

    @HostBinding('attr.data-draggable')
    public draggable = false;

    @HostBinding('class.cursor-all-scroll')
    public get cursorAllScroll() {
        return this.draggable;
    }

    @HostBinding('class.select-none')
    public get selectNone() {
        return this.draggable;
    }

    @HostBinding('style.top')
    public get top() {
        const startDateTime = DateTime.fromISO(this.item.start);
        const minutes = startDateTime.diff(DateTime.fromISO(this.item.start).startOf('day'), 'minutes').minutes;
        return `${(minutes * this.calendarWithSpecialistLocaStateService.oneMinuteForPx) + this.calendarWithSpecialistLocaStateService.specialistCellHeightForPx}px`;
    }

    @HostBinding('style.height')
    public get height() {
        const endDateTime = DateTime.fromISO(this.item.end);
        const startDateTime = DateTime.fromISO(this.item.start);
        const duration = endDateTime.diff(startDateTime, 'minutes').minutes;
        return `${(duration * this.calendarWithSpecialistLocaStateService.oneMinuteForPx)}px`;
    }

    @HostBinding('style.width')
    public get width() {
        return '100%';
    }

    @ViewChild(OrderEventCalendarWithSpecialistWidgetComponent)
    private orderEventCalendarWithSpecialistWidgetComponent!: OrderEventCalendarWithSpecialistWidgetComponent;

    @ViewChild(AbsenceEventCalendarWithSpecialistWidgetComponent)
    private absenceEventCalendarWithSpecialistWidgetComponent!: AbsenceEventCalendarWithSpecialistWidgetComponent;

    @HostListener('click', ['$event'])
    public async click($event: MouseEvent) {
        if (this.draggable) {
            return;
        }
        const popover = await this.popoverController.create({
            event: $event,
            component: PopoverMenuEventComponent,
            componentProps: {
                onClick: (item: 'freeMovement' | 'openDetails') => {
                    switch (item) {
                        case 'freeMovement':
                            this.toggleMode(true);
                            break;
                        case 'openDetails':
                            this.orderEventCalendarWithSpecialistWidgetComponent?.onClick?.();
                            this.absenceEventCalendarWithSpecialistWidgetComponent?.onClick?.();
                            break;
                    }
                    popover.dismiss();
                },
            },
        });

        await popover.present();
        const {role} = await popover.onDidDismiss();
        console.log(`Popover dismissed with role: ${role}`);
    }

    public readonly calendarWithSpecialistLocaStateService = inject(CalendarWithSpecialistLocaStateService);
    public readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private readonly popoverController = inject(PopoverController);

    public toggleMode(force?: boolean): void {
        console.log('toggleMode', force, this.draggable)
        this.draggable = force ?? !this.draggable;
        this.draggable && this.calendarWithSpecialistLocaStateService.setEventCalendarWithSpecialistWidgetComponent(this);
        !this.draggable && this.calendarWithSpecialistLocaStateService.setEventCalendarWithSpecialistWidgetComponent(null);
        this.changeDetectorRef.detectChanges();

    }

    public isOrder(event: DATA): event is IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; }> {
        return event.is === 'order';
    }

    public isAbsence(event: DATA): event is IEvent_V2<IAbsenceDto> {
        return event.is === 'absence';
    }

}
