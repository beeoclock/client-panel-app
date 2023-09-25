import {FormArray} from "@angular/forms";
import {ServiceForm} from "@service/presentation/form/service.form";
import {IService} from "@service/domain";

export class ServicesForm extends FormArray<ServiceForm> {
	constructor() {
		super([new ServiceForm()]);
	}

	public remove(index: number): void {
		this.controls.splice(index, 1);
	}

	public pushNewOne(initialValue?: IService): void {
		const control = new ServiceForm(initialValue);
		this.controls.push(control);
	}
}
