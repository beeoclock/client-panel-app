import {RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {EventState} from "@event/state/event/event.state";
import {routers} from "@event/presentation";
import {CalendarState} from "@event/state/calendar/calendar.state";
import {StatisticState} from "@event/state/statistic/statistic.state";


@NgModule({
  imports: [
    NgxsModule.forFeature([EventState, CalendarState, StatisticState]),
    RouterModule.forChild(routers)
  ]
})
export class Module {
}
