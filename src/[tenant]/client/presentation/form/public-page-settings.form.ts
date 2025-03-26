import {FormControl, FormGroup} from "@angular/forms";

export interface IPublicPageSettings {
	primaryColor: FormControl<string>;
}

export class PublicPageSettings extends FormGroup<IPublicPageSettings> {

	constructor() {
		super({
			primaryColor: new FormControl('#000000', {
				nonNullable: true,
			}),
		});

		this.initValidators();

	}

	private initValidators(): void {
	}

}
