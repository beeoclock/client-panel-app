import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {delay, filter, iif, of, switchMap, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {AsyncPipe} from "@angular/common";
import {ITableState} from "@shared/domain/table.state";
import {Reactive} from "@core/cdk/reactive";
import {MemberProfileStatusEnum} from "@tenant/member/member/domain/enums/member-profile-status.enum";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {IMember} from "@tenant/member/member/domain/interface/i.member";
import {MemberDataState} from "@tenant/member/member/infrastructure/state/data/member.data.state";
import {MemberDataActions} from "@tenant/member/member/infrastructure/state/data/member.data.actions";
import ScheduleV3ContainerWeekCalendarComponent from "./schedule.container.week-calendar.component";
import WeekCalendarLocaStateService from "./week-calendar.local.state.service";

@Component({
	selector: 'app-event-members-container-week-calendar-component',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (item$ | async) {
			<app-event-schedule-container-week-calendar-component/>
		}
	`,
	imports: [
		AsyncPipe,
		ScheduleV3ContainerWeekCalendarComponent
	]
})
export default class MembersV3ContainerWeekCalendarComponent extends Reactive {

	private readonly store = inject(Store);
	private readonly weekCalendarLocaStateService = inject(WeekCalendarLocaStateService);

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
			this.weekCalendarLocaStateService.setMembers(members);
		})
	);

	@Dispatch()
	private initMemberList() {
		return new MemberDataActions.GetList()
	}

}
