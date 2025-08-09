import {FormControl, FormGroup} from "@angular/forms";
import {IPresentation} from "@tenant/service/domain";
import {IMedia} from "@tenant/media/domain/interface/i.media";

export interface IServicePresentationForm {
	banners: FormControl<IMedia[]>;
}

export class ServicePresentationForm extends FormGroup<IServicePresentationForm> {
	constructor(initialValue: Partial<IPresentation> = {}) {
		super({
			banners: new FormControl(),
		});
		this.patchValue(initialValue);
	}

}
