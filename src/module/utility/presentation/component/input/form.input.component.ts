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
import {
	NullValueAccessorDirective
} from "@utility/presentation/directives/null-value-accessor/null-value-accessor.directive";

@Component({
	selector: 'form-input',
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
		NullValueAccessorDirective,
	],
	template: `

		<!-- Input Group -->
		<div>
			<!-- Floating Input -->
			<div class="relative">
				<input
					isRequired
					invalidTooltip
					emptyStringToNull
					[step]="step"
					[min]="min"
					[formControl]="control"
					[placeholder]="placeholder ?? (placeholderTranslateKey | translate)"
					[id]="id + '-input'"
					[type]="inputType"
					[autocomplete]="autocomplete"

					class="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
focus:pt-6
															  focus:pb-2
															  [&:not(:placeholder-shown)]:pt-6
															  [&:not(:placeholder-shown)]:pb-2
															  autofill:pt-6
															  autofill:pb-2">
				<label
					[id]="id + '-label'"
					[for]="id + '-input'" class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90
                        peer-focus:translate-x-0.5
                        peer-focus:-translate-y-1.5
                        peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-[:not(:placeholder-shown)]:scale-90
                        peer-[:not(:placeholder-shown)]:translate-x-0.5
                        peer-[:not(:placeholder-shown)]:-translate-y-1.5
                        peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">
					{{ label ?? (labelTranslateKey | translate) }}
				</label>

			</div>
			<!-- End Floating Input -->
		</div>
		<!-- End Input Group -->
	`
})
export class FormInputComponent implements DoCheck {

	@Input()
	public label: unknown | string;

	@Input()
	public labelTranslateKey = '';

	@Input()
	public id = 'utility-base-input';

	@Input()
	public inputType = 'text';

	@Input()
	public min: number | null = null;

	@Input()
	public placeholder: string | null = null;

	@Input()
	public placeholderTranslateKey = '';

	@Input()
	public autocomplete = '';

	@Input()
	public step = 60; // In seconds

	@Input()
	public control!: FormControl;

	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	@HostBinding()
	public class = 'block';

	public ngDoCheck(): void {
		this.changeDetectorRef.detectChanges();
	}


}
