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
	],
	template: `
		<label default *ngIf="showLabel" [for]="id">
			{{ label ?? (labelTranslateKey | translate) }}
		</label>
		<ng-content/>
		<input
			isRequired
			invalidTooltip
			default
			[step]="step"
			[isRequiredEnabled]="showLabel"
			[formControl]="control"
			[classList]="customClassList"
			[additionalClassList]="additionalClassList"
			[placeholder]="placeholder ?? (placeholderTranslateKey | translate)"
			[id]="id"
			[type]="inputType"
			[autocomplete]="autocomplete"/>
	`
})
export class FormInputComponent implements DoCheck {

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
	public customClassList: string = '';

	@Input()
	public additionalClassList: string = '';

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
