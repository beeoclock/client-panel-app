import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
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
import ScheduleV2ContainerWeekCalendarComponent from "./schedule.container.week-calendar.component";
import {MemberProfileStatusEnum} from "@member/domain/enums/member-profile-status.enum";
import CalendarWithSpecialistLocaStateService
	from "@page/event/calendar-with-specialists/v2/calendar-with-specialist.loca.state.service";

@Component({
	selector: 'app-event-v2-members-container-week-calendar-component',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (item$ | async) {
			<app-event-v2-schedule-container-week-calendar-component/>
		}
	`,
	imports: [
		NgIf,
		AsyncPipe,
		ScheduleV2ContainerWeekCalendarComponent
	]
})
export default class MembersV2ContainerWeekCalendarComponent extends Reactive {

	private readonly store = inject(Store);
	private readonly calendarWithSpecialistLocaStateService = inject(CalendarWithSpecialistLocaStateService);

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
			const members = tableState.items.filter((member: RIMember) => member.profileStatus === MemberProfileStatusEnum.active);
			this.calendarWithSpecialistLocaStateService.setMembers(members);
		})
	);


}
