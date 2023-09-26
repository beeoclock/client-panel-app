import {FormArray} from "@angular/forms";
import {ServiceForm} from "@service/presentation/form/service.form";
import {IService} from "@service/domain";

export class ServicesForm extends FormArray<ServiceForm> {
	constructor() {
		super([new ServiceForm()]);
	}

	public pushNewOne(initialValue?: IService): void {
		const control = new ServiceForm(initialValue);
		this.push(control);
	}
}
