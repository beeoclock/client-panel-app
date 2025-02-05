import {FormArray} from "@angular/forms";
import {ServiceForm} from "@service/presentation/form/service.form";
import {IServiceDto} from "@order/domain/interface/i.service.dto";


export class ServicesForm extends FormArray<ServiceForm> {
	constructor(initValue = [new ServiceForm()]) {
		super(initValue);
	}

	public pushNewOne(initialValue?: IServiceDto): void {
		const control = new ServiceForm(initialValue);
		this.push(control);
	}
}
