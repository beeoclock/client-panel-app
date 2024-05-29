import {Component, Input} from "@angular/core";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {ISpecialist} from "@service/domain/interface/i.specialist";
import {TranslateModule} from "@ngx-translate/core";
import {MemberSelector} from "@member/state/member/member.selector";
import {Select} from "@ngxs/store";
import {RIMember} from "@member/domain";
import {Observable} from "rxjs";
import {TableState} from "@utility/domain/table.state";
import {FormControl} from "@angular/forms";
import {IService} from "@service/domain";

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
	public serviceListControl!: FormControl<IService[]>;

	@Input({required: true})
	public index!: number;

	@Select(MemberSelector.tableState)
	public memberTableState$!: Observable<TableState<RIMember>>;

	public get selectedSpecialist(): ISpecialist | undefined {
		const service = this.serviceListControl.value[this.index];
		if (service?.specialists?.length > 0) {
			return service.specialists[0];
		}
		return undefined;
	}

	public changeMemberInSpecialist(member: RIMember): void {
		const services = this.serviceListControl.value.map((service, index) => {
			if (this.index === index) {
				return {
					...service,
					specialists: [{
						object: 'Specialist' as ISpecialist['object'],
						member
					}],
				};
			}
			return service;
		});

		this.serviceListControl.setValue(services);

	}

}
