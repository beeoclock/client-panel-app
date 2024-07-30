import {Component, Input} from "@angular/core";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {ISpecialist} from "@service/domain/interface/i.specialist";
import {TranslateModule} from "@ngx-translate/core";
import {MemberSelector} from "@member/state/member/member.selector";
import {Select} from "@ngxs/store";
import {RIMember} from "@member/domain";
import {map, Observable} from "rxjs";
import {TableState} from "@utility/domain/table.state";
import {FormControl} from "@angular/forms";

import {MemberProfileStatusEnum} from "@member/domain/enums/member-profile-status.enum";
import {IServiceDto} from "@order/external/interface/i.service.dto";

@Component({
	selector: 'event-service-specialist-component',
	templateUrl: './specialist.service.component.html',
	standalone: true,
	imports: [
		AsyncPipe,
		NgForOf,
		NgIf,
		TranslateModule
	]
})
export class SpecialistServiceComponent {

	@Input({required: true})
	public serviceListControl!: FormControl<IServiceDto[]>;

	@Input({required: true})
	public index!: number;

	@Input({required: true})
	public service!: IServiceDto;

	@Select(MemberSelector.tableState)
	private memberTableState$!: Observable<TableState<RIMember>>;

	public readonly members$: Observable<RIMember[]> = this.memberTableState$.pipe(
		map(({items}) => {
			return items.filter(member => {
				if (member.profileStatus === MemberProfileStatusEnum.active) {
					if (!member.assignments.service.full) {
						const specialistCanServeService = member.assignments.service.include.some(({service: {_id}}) => _id === this.service._id);
						return specialistCanServeService;
					}
					return  true;
				}
				return false;
			});
		})
	);

	public get selectedSpecialist(): ISpecialist | undefined {
		const service = this.serviceListControl.value[this.index];
		// if (service?.specialists?.length > 0) {
		// 	return service.specialists[0];
		// }
		return undefined;
	}

	public changeMemberInSpecialist(member: RIMember): void {
		const services = this.serviceListControl.value.map((service, index) => {
			if (this.index === index) {
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

		this.serviceListControl.setValue(services);

	}

}
