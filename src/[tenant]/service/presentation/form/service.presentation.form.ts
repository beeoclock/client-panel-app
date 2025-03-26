import {FormControl, FormGroup} from "@angular/forms";
import {IPresentation} from "@core/business-logic/service";
import {RIMedia} from "@[tenant]/media/domain/interface/i.media";

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
