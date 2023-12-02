import {AbstractControl, FormControl, FormGroup} from "@angular/forms";
import {BannerType, IPresentation} from "@service/domain";

export interface IServicePresentationForm {
	banners: FormControl<BannerType[]>;

	[key: string]: AbstractControl;
}

export class ServicePresentationForm extends FormGroup<IServicePresentationForm> {
	constructor(initialValue?: IPresentation) {
		super({
			banners: new FormControl(),
		});
		this.initValue(initialValue);
	}

	public initValue(initialValue?: IPresentation): void {
		this.controls.banners.setValue([]);
		if (initialValue) {
			Object.keys(initialValue).forEach(key => {
				if (this.contains(key)) {
					this.controls[key].setValue((initialValue as never)[key]);
				}
			});
		}
	}

}
