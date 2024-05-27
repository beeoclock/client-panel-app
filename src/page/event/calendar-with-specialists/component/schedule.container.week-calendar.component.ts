import {Component, inject} from "@angular/core";
import {ClientState} from "@client/state/client/client.state";
import {Store} from "@ngxs/store";
import {filter, tap} from "rxjs";
import {is} from "thiis";
import {RISchedule} from "@utility/domain/interface/i.schedule";
import {Reactive} from "@utility/cdk/reactive";
import {ComposeCalendarWithSpecialistsService} from "./compose.calendar-with-specialists.service";
import {ComposeCalendarWithSpecialistsComponent} from "./compose.calendar-with-specialists.component";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
    selector: 'event-schedule-container-week-calendar-component',
    standalone: true,
    template: `
        <ng-container *ngIf="item$ | async">
            <event-compose-calendar-with-specialists-component/>
        </ng-container>
    `,
    imports: [
        ComposeCalendarWithSpecialistsComponent,
        NgIf,
        AsyncPipe
    ]
})
export class ScheduleContainerWeekCalendarComponent extends Reactive {

    private readonly store = inject(Store);
    private readonly composeCalendarWithSpecialistsService = inject(ComposeCalendarWithSpecialistsService);

    public readonly item$ = this.store.select(ClientState.earliestScheduleAndLatestSchedule).pipe(
        this.takeUntil(),
        filter(is.not_null<{ earliestSchedule: RISchedule; latestSchedule: RISchedule; }>),
        tap(({earliestSchedule, latestSchedule}) => {

            this.composeCalendarWithSpecialistsService.setStartTimeToDisplay(earliestSchedule.startInSeconds / 3600);
            this.composeCalendarWithSpecialistsService.setEndTimeToDisplay(latestSchedule.endInSeconds / 3600);

        })
    );

}
