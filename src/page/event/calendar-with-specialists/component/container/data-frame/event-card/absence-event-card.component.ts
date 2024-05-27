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
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";

@Component({
    selector: 'absence-event-card-component',
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
            BREAK
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
export class AbsenceEventCardComponent {

    @Input()
    public event!: {
        data: IEvent_V2<IAbsenceDto>;
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

        const startRowIndex = 1;
        const {startTime} = this.card;

        if ((startTime - this.startTimeToDisplay) <= 0) {
            return startRowIndex;
        }

        const startTimeWithoutDecimalPart = Math.floor(startTime);
        const startTimeWithOffset = startTimeWithoutDecimalPart - this.startTimeToDisplay;
        const result = (startTimeWithOffset * this.stepPerHour) + startRowIndex
        // take decimal part of the result and round it to 0 or 25 or 50 or 75
        const decimalPart = startTime % 1;
        const roundedDecimalPart = Math.floor(decimalPart * this.stepPerHour);

        console.log({
            event: this.event,
            result,
            startTime,
            roundedDecimalPart,
            newSomething: Math.floor(result) + roundedDecimalPart
        })

        return Math.floor(result) + roundedDecimalPart;

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

        classList.push('bg-gray-600', 'border-gray-600', 'hover:bg-gray-700');

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
