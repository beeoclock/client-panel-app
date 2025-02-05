import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {Store} from "@ngxs/store";
import {delay, filter, iif, of, switchMap, tap} from "rxjs";
import {is} from "@utility/checker";
import {AsyncPipe} from "@angular/common";
import {MemberState} from "@member/state/member/member.state";
import {ITableState} from "@utility/domain/table.state";
import * as Member from "@member/domain";
import {RIMember} from "@member/domain";
import {Reactive} from "@utility/cdk/reactive";
import ScheduleV2ContainerWeekCalendarComponent from "./schedule.container.week-calendar.component";
import {MemberProfileStatusEnum} from "@member/domain/enums/member-profile-status.enum";
import CalendarWithSpecialistLocaStateService
	from "@page/event/calendar-with-specialists/v2/calendar-with-specialist.loca.state.service";
import {MemberActions} from "@member/state/member/member.actions";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {NGXLogger} from "ngx-logger";

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
		AsyncPipe,
		ScheduleV2ContainerWeekCalendarComponent
	]
})
export default class MembersV2ContainerWeekCalendarComponent extends Reactive implements OnInit {

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly calendarWithSpecialistLocaStateService = inject(CalendarWithSpecialistLocaStateService);

	public readonly item$ = this.store.select(MemberState.tableState).pipe(
		this.takeUntil(),
		// If tableState is empty then wait one second and try call initMemberList use iif and delay
		switchMap((tableState) => {
			return iif(
				() => tableState.total === 0,
				of(tableState).pipe(
					delay(1_000),
					tap(() => this.initMemberList())
				),
				of(tableState)
			);
		}),
		filter(is.object_not_empty<ITableState<Member.RIMember>>),
		filter((tableState) => tableState.total > 0),
		tap((tableState) => {
			const members = tableState.items.filter((member: RIMember) => member.profileStatus === MemberProfileStatusEnum.active);
			this.calendarWithSpecialistLocaStateService.setMembers(members);
		})
	);

	@Dispatch()
	private initMemberList() {
		return new MemberActions.GetList()
	}

	public ngOnInit(): void {
		this.ngxLogger.info('MembersV2ContainerWeekCalendarComponent');
	}


}
