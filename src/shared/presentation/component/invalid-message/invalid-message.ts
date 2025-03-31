import {Component, HostBinding, Input, input} from "@angular/core";
import {AbstractControl} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {FirstKeyNamePipe} from "@shared/presentation/pipes/first-key-name/first-key-name.pipe";

@Component({
	selector: 'utility-invalid-message',
	template: `
		{{ (translationKey() + (control()?.errors | firstKeyName)) | translate: control()?.errors?.[(control()?.errors | firstKeyName)] }}
	`,
	imports: [
		TranslateModule,
		FirstKeyNamePipe,
	],
	standalone: true,
})
export class InvalidTooltipComponent {

	public readonly control = input.required<AbstractControl<unknown> | undefined>();

	public readonly position = input<'top' | 'bottom'>('bottom');

	public readonly translationKey = input('form.validation.');

	@Input()
	@HostBinding('class')
	public invalidClass = 'flex px-3 py-1 bg-red-500 text-white rounded-2xl';

	@HostBinding('class.hidden')
	public get hide(): boolean {
		return !this.control()?.errors;
	}

}
