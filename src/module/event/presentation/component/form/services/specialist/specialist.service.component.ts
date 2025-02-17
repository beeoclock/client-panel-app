import {Component, input} from "@angular/core";
import {AsyncPipe} from "@angular/common";
import {ISpecialist} from "@src/core/business-logic/service/interface/i.specialist";
import {TranslateModule} from "@ngx-translate/core";
import {MemberSelector} from "@member/infrastructure/state/member/member.selector";
import {Select} from "@ngxs/store";
import {RIMember} from "@src/core/business-logic/member";
import {map, Observable} from "rxjs";
import {TableState} from "@utility/domain/table.state";
import {FormControl} from "@angular/forms";

import {MemberProfileStatusEnum} from "@src/core/business-logic/member/enums/member-profile-status.enum";
import {IService} from "@core/business-logic/service/interface/i.service";

@Component({
	selector: 'event-service-specialist-component',
	templateUrl: './specialist.service.component.html',
	standalone: true,
	imports: [
		AsyncPipe,
		TranslateModule
	]
})
export class SpecialistServiceComponent {

	public readonly serviceListControl = input.required<FormControl<IService.DTO[]>>();

	public readonly index = input.required<number>();

	public readonly service = input.required<IService.DTO>();

	@Select(MemberSelector.tableState)
	private memberTableState$!: Observable<TableState<RIMember>>;

	public readonly members$: Observable<RIMember[]> = this.memberTableState$.pipe(
		map(({items}) => {
			return items.filter(member => {
				if (member.profileStatus === MemberProfileStatusEnum.active) {
					if (!member.assignments.service.full) {
						const specialistCanServeService = member.assignments.service.include.some(({service: {_id}}) => _id === this.service()._id);
						return specialistCanServeService;
					}
					return true;
				}
				return false;
			});
		})
	);

	public get selectedSpecialist(): ISpecialist | undefined {
		const service = this.serviceListControl().value[this.index()];
		// if (service?.specialists?.length > 0) {
		// 	return service.specialists[0];
		// }
		return undefined;
	}

	public changeMemberInSpecialist(member: RIMember): void {
		const services = this.serviceListControl().value.map((service, index) => {
			if (this.index() === index) {
				return {
					...service,
					specialists: [{
						object: 'Specialist' as ISpecialist['object'],
						member,
						wasSelectedAnybody: false,
					}],
				};
			}
			return service;
		});

		this.serviceListControl().setValue(services);

	}

}
