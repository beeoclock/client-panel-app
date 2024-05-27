import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    HostListener,
    inject,
    Input,
    ViewEncapsulation
} from "@angular/core";

import {IAttendee, IEvent_V2} from "@event/domain";
import {DatePipe, NgIf} from "@angular/common";
import {Store} from "@ngxs/store";
import {EventActions} from "@event/state/event/event.actions";
import {
    ComposeCalendarWithSpecialistsService
} from "@page/event/calendar-with-specialists/component/compose.calendar-with-specialists.service";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";

@Component({
    selector: 'order-event-card-component',
    template: `
        <div class="flex flex-wrap gap-1">
			<span class="text-xs dark:text-sky-100">
				{{ event.data.start | date: 'HH:mm' }} - {{ event.data.end | date: 'HH:mm' }}
			</span>
            <span class="text-xs font-bold dark:text-sky-100">
				{{ getAttendeesInformation() }}
			</span>
        </div>
        <div class="text-xs font-medium">
            {{ event.data.originalData.service.serviceSnapshot.languageVersions[0].title }}
        </div>
        <div *ngIf="event.data.note" class="text-xs font-medium">
            📓 {{ event.data.note }}
        </div>
    `,
    standalone: true,
    imports: [
        DatePipe,
        NgIf
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderEventCardComponent {

    @Input()
    public event!: {
        data: IEvent_V2<{order: IOrderDto; service: IOrderServiceDto;}>;
        card: {
            startTime: number;
            durationInMinutes: number;
            column: number;
        };
    };

    @Input()
    public card!: {
        startTime: number;
        durationInMinutes: number;
        column: number;
    };

    private readonly composeCalendarWithSpecialistsService = inject(ComposeCalendarWithSpecialistsService);
    private readonly store = inject(Store);

    public readonly slotInMinutes = this.composeCalendarWithSpecialistsService.slotInMinutes;
    public readonly startTimeToDisplay = this.composeCalendarWithSpecialistsService.startTimeToDisplay;
    public readonly stepPerHour = this.composeCalendarWithSpecialistsService.stepPerHour;

    @HostListener('click')
    public async onClick() {
        await this.openEventDetails(this.event.data);
    }

    @HostBinding('style.grid-row-start')
    public get gridRowStart() {
        return this.card.startTime > 0 ? ((this.card.startTime - this.startTimeToDisplay) * this.stepPerHour) + 1 : 1;
    }

    @HostBinding('style.grid-row-end')
    public get gridRowEnd() {
        return (this.card.startTime > 0 ? (((this.card.startTime - this.startTimeToDisplay) * this.stepPerHour) + 1) : 1) + (this.card.durationInMinutes / this.slotInMinutes);
    }

    @HostBinding('style.grid-column-start')
    public get gridColumnStart() {
        return this.card.column;
    }

    @HostBinding('class')
    public get class() {

        // Choose color by status
        const classList = [
            'transition-all hover:cursor-pointer z-10 border rounded-lg m-1 p-1 flex flex-col text-white overflow-hidden',
        ];

        const {service} = this.event.data.originalData;
        switch (service.status) {
            case OrderServiceStatusEnum.rejected:
            case OrderServiceStatusEnum.cancelled:
                classList.push('bg-red-400', 'border-red-400', 'hover:bg-red-500');
                break;
            case OrderServiceStatusEnum.requested:
                classList.push('bg-orange-400', 'border-orange-500', 'hover:bg-orange-500');
                break;
            case OrderServiceStatusEnum.accepted:
                classList.push('bg-blue-400', 'border-blue-400', 'hover:bg-blue-500');
                break;
            case OrderServiceStatusEnum.done:
                classList.push('bg-green-500', 'border-green-500', 'hover:bg-green-600');
                break;
        }

        return classList.join(' ');
    }

    public getAttendeesInformation() {
        return this.event.data.attendees?.map((attendant) => {
            if (attendant.is !== 'customer') {
                return;
            }

            const {customer} = attendant.originalData as IAttendee;

            if (customer?.firstName) {
                return customer?.firstName;
            }
            if (customer?.phone) {
                return customer?.phone;
            }
            if (customer?.email) {
                return customer?.email;
            }
            return '';
        }).join(', ');
    }

    private async openEventDetails(event: IEvent_V2) {
        this.store.dispatch(new EventActions.OpenDetailsById(event._id));
    }

}
