import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {SocialNetworkEnum} from "@core/shared/enum/social-network.enum";
import {ISocialNetworkLink} from "@tenant/business-profile/domain/interface/i.social-network-link";

export interface ISocialNetworkForm {

	object: FormControl<'SocialNetworkLink'>;
	link: FormControl<string>;
	type: FormControl<SocialNetworkEnum>;
}

export class SocialNetworkForm extends FormGroup<ISocialNetworkForm> {

	constructor() {
		super({
			object: new FormControl('SocialNetworkLink', {
				nonNullable: true,
			}),
			link: new FormControl(),
			type: new FormControl(),
		});

		this.initValue();

	}

	private initValue(): void {
		this.controls.type.setValue(SocialNetworkEnum.INSTAGRAM);
	}

}

export class SocialNetworksForm extends FormArray<SocialNetworkForm> {
	constructor() {
		super([]);
	}

	public pushNewOne(initialValue?: ISocialNetworkLink): void {
		const control = new SocialNetworkForm();
		if (initialValue) {
			control.patchValue(initialValue);
		}
		this.push(control);
	}

}
