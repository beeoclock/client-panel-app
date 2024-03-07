import {Component, inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {filter, tap} from "rxjs";
import {
	ComposeCalendarWithSpecialistsComponent
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.component";
import {is} from "thiis";
import {AsyncPipe, NgIf} from "@angular/common";
import {MemberState} from "@member/state/member/member.state";
import {ITableState} from "@utility/domain/table.state";
import * as Member from "@member/domain";
import {
	ScheduleContainerWeekCalendarComponent
} from "@event/presentation/page/calendar-with-specialists/component/schedule.container.week-calendar.component";
import {MemberActions} from "@member/state/member/member.actions";
import {
	ComposeCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.service";

@Component({
	selector: 'event-members-container-week-calendar-component',
	standalone: true,
	template: `
		<ng-container *ngIf="item$ | async">
			<event-schedule-container-week-calendar-component/>
		</ng-container>
	`,
	imports: [
		ComposeCalendarWithSpecialistsComponent,
		NgIf,
		AsyncPipe,
		ScheduleContainerWeekCalendarComponent
	]
})
export class MembersContainerWeekCalendarComponent {

	private readonly store = inject(Store);
	private readonly composeCalendarWithSpecialistsService = inject(ComposeCalendarWithSpecialistsService);

	public readonly item$ = this.store.select(MemberState.tableState).pipe(
		filter(is.object_not_empty<ITableState<Member.RIMember>>),
		tap((tableState) => {
			console.log(tableState);
			if (tableState.total === 0) {
				this.store.dispatch(new MemberActions.GetList());
			}
		}),
		filter((tableState) => tableState.total > 0),
		tap((tableState) => {
			this.composeCalendarWithSpecialistsService.setMembers(tableState.items);
		})
	);


}
