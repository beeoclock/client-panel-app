import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DoCheck,
	HostBinding,
	inject,
	Input,
	ViewEncapsulation
} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {DefaultInputDirective} from "@utility/presentation/directives/input/default.input.directive";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {FloatingLabelDirective} from "@utility/presentation/directives/label/floating.label.directive";
import {FloatingInputDirective} from "@utility/presentation/directives/input/floating.input.directive";
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'form-input-with-left-hint',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IsRequiredDirective,
		InvalidTooltipDirective,
		ReactiveFormsModule,
		NgIf,
		DefaultInputDirective,
		DefaultLabelDirective,
		FloatingLabelDirective,
		FloatingInputDirective,
		TranslateModule,
	],
	template: `
		<label default *ngIf="showLabel" [for]="id">
			{{ label ?? (labelTranslateKey | translate) }}
		</label>
		<ng-content/>

		<div
			class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
				<span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
					{{ leftHint }}
				</span>
			<input
				isRequired
				invalidTooltip
				class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
				[isRequiredEnabled]="showLabel"
				[formControl]="control"
				[placeholder]="placeholder ?? (placeholderTranslateKey | translate)"
				[id]="id"
				[type]="inputType"
				[autocomplete]="autocomplete"/>
		</div>
	`
})
export class FormInputWithLeftHintComponent implements DoCheck {

	@Input({required: true})
	public leftHint: unknown | string;

	@Input()
	public label: unknown | string;

	@Input()
	public labelTranslateKey = '';

	@Input()
	public showLabel = true;

	@Input()
	public id = 'utility-base-input';

	@Input()
	public inputType = 'text';

	@Input()
	public placeholder: string | null = null;

	@Input()
	public placeholderTranslateKey = '';

	@Input()
	public autocomplete = '';

	@Input({required: true})
	public control!: FormControl;

	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	@HostBinding()
	public class = 'block';

	public ngDoCheck(): void {
		this.changeDetectorRef.detectChanges();
	}


}
