import {FormArray} from "@angular/forms";
import {ServiceForm} from "@[tenant]/service/presentation/form/service.form";
import {IService} from "@core/business-logic/service/interface/i.service";


export class ServicesForm extends FormArray<ServiceForm> {
	constructor(initValue = [new ServiceForm()]) {
		super(initValue);
	}

	public pushNewOne(initialValue?: IService.DTO): void {
		const control = new ServiceForm(initialValue);
		this.push(control);
	}
}
