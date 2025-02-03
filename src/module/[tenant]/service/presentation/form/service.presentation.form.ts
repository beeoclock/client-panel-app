import {FormControl, FormGroup} from "@angular/forms";
import {IPresentation} from "@service/domain";
import {RIMedia} from "@media/domain/interface/i.media";

export interface IServicePresentationForm {
	banners: FormControl<RIMedia[]>;
}

export class ServicePresentationForm extends FormGroup<IServicePresentationForm> {
	constructor(initialValue: Partial<IPresentation> = {}) {
		super({
			banners: new FormControl(),
		});
		this.patchValue(initialValue);
	}

}
