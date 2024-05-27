import {Component, inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {filter, tap} from "rxjs";
import {is} from "thiis";
import {AsyncPipe, NgIf} from "@angular/common";
import {MemberState} from "@member/state/member/member.state";
import {ITableState} from "@utility/domain/table.state";
import * as Member from "@member/domain";
import {RIMember} from "@member/domain";
import {MemberActions} from "@member/state/member/member.actions";
import {Reactive} from "@utility/cdk/reactive";
import {ActiveEnum} from "@utility/domain/enum";
import {ScheduleContainerWeekCalendarComponent} from "./schedule.container.week-calendar.component";
import {ComposeCalendarWithSpecialistsService} from "./compose.calendar-with-specialists.service";
import {ComposeCalendarWithSpecialistsComponent} from "./compose.calendar-with-specialists.component";

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
export class MembersContainerWeekCalendarComponent extends Reactive {

	private readonly store = inject(Store);
	private readonly composeCalendarWithSpecialistsService = inject(ComposeCalendarWithSpecialistsService);

	public readonly item$ = this.store.select(MemberState.tableState).pipe(
		this.takeUntil(),
		filter(is.object_not_empty<ITableState<Member.RIMember>>),
		tap((tableState) => {
			if (tableState.total === 0) {
				this.store.dispatch(new MemberActions.GetList());
			}
		}),
		filter((tableState) => tableState.total > 0),
		tap((tableState) => {
			const members = tableState.items.filter((member: RIMember) => member.active === ActiveEnum.YES);
			this.composeCalendarWithSpecialistsService.setMembers(members);
		})
	);


}
