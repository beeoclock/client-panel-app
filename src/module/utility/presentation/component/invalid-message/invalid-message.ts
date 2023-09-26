import {Component, HostBinding, Input} from "@angular/core";
import {AbstractControl} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {FirstKeyNameModule} from "@utility/presentation/pipes/first-key-name/first-key-name.module";

@Component({
	selector: 'utility-invalid-message',
	template: `
		{{(translationKey + (control?.errors | firstKeyName)) | translate: control?.errors?.[(control?.errors | firstKeyName)]}}
	`,
	imports: [
		TranslateModule,
		FirstKeyNameModule,
	],
	standalone: true,
})
export class InvalidTooltipComponent {
	@Input()
	public control!: AbstractControl<unknown> | undefined;

	@Input()
	public position: 'top' | 'bottom' = 'bottom';

	@Input()
	public translationKey = 'form.validation.';

	@Input()
	@HostBinding('class')
	public invalidClass = 'px-3 py-1 bg-red-500 text-white rounded-2xl';
}
