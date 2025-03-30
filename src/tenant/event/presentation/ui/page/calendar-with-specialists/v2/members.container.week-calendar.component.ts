import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {Store} from "@ngxs/store";
import {delay, filter, iif, of, switchMap, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {AsyncPipe} from "@angular/common";
import {ITableState} from "@utility/domain/table.state";
import {Reactive} from "@utility/cdk/reactive";
import ScheduleV2ContainerWeekCalendarComponent from "./schedule.container.week-calendar.component";
import {MemberProfileStatusEnum} from "@core/business-logic/member/enums/member-profile-status.enum";
import CalendarWithSpecialistLocaStateService
	from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/calendar-with-specialist.loca.state.service";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {NGXLogger} from "ngx-logger";
import {IMember} from "@core/business-logic/member/interface/i.member";
import {MemberDataState} from "@tenant/member/presentation/state/data/member.data.state";
import {MemberDataActions} from "@tenant/member/presentation/state/data/member.data.actions";

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

	public readonly item$ = this.store.select(MemberDataState.tableState).pipe(
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
		filter(is.object_not_empty<ITableState<IMember.EntityRaw>>),
		filter((tableState) => tableState.total > 0),
		tap((tableState) => {
			const members = tableState.items.filter((member: IMember.EntityRaw) => member.profileStatus === MemberProfileStatusEnum.active);
			this.calendarWithSpecialistLocaStateService.setMembers(members);
		})
	);

	@Dispatch()
	private initMemberList() {
		return new MemberDataActions.GetList()
	}

	public ngOnInit(): void {
		this.ngxLogger.info('MembersV2ContainerWeekCalendarComponent');
	}


}
