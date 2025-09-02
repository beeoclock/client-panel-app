import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DoCheck,
	ElementRef,
	inject,
	input,
	OnDestroy,
	viewChild,
	ViewEncapsulation
} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {IsRequiredDirective} from '@shared/presentation/directives/is-required/is-required';
import {InvalidTooltipDirective} from '@shared/presentation/directives/invalid-tooltip/invalid-tooltip.directive';
import intlTelInput, {Iti} from 'intl-tel-input';
import {is} from '@core/shared/checker';
import {TranslateModule} from "@ngx-translate/core";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {Store} from "@ngxs/store";

@Component({
	selector: 'tel-form-input',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IsRequiredDirective,
		InvalidTooltipDirective,
		ReactiveFormsModule,
		TranslateModule,
	],
	template: `
		@if (showLabel()) {
			<label
				[for]="id()"
				class="block text-sm font-medium leading-6 text-beeColor-900 dark:text-white">
				{{ label() || (labelTranslateKey() | translate) }}
			</label>
		}
		<input
			hidden
			isRequired
			invalidTooltip
			[id]="id()"
			[needTouched]="false"
			[setRedBorderTo]="'#' + id() + '-mirror'"
			[formControl]="control()"
			[isRequiredEnabled]="showLabel()">

		<input
			#inputElement
			[id]="id() + '-mirror'"
			[class.disabled]="control().disabled"
			[placeholder]="placeholder()"
			[autocomplete]="autocomplete()"
			type="tel"
			class="w-full bg-white rounded-md border border-gray-200 px-3 py-2 placeholder:text-slate-600"
		/>
	`,
	host: {
		class: 'w-full relative block'
	}
})
export class TelFormInputComponent implements AfterViewInit, OnDestroy, DoCheck {
	public readonly label = input('');

	public readonly labelTranslateKey = input('');

	public readonly showLabel = input(true);

	public readonly id = input('utility-base-input');

	public readonly placeholder = input<string>('000 00 00 00');

	public readonly placeholderTranslateKey = input<string>('');

	public readonly autocomplete = input<string>('');

	public readonly control = input.required<FormControl<string | null>>();

	public readonly fallbackCountryCode = input<string>('us');

	readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('inputElement');

	public intlTelInput: Iti | null = null;

	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly store = inject(Store);
	private readonly businessProfile = this.store.selectSnapshot(BusinessProfileState.item);

	public ngDoCheck(): void {
		this.changeDetectorRef.detectChanges();
	}

	public ngAfterViewInit() {

		const businessProfile = this.businessProfile;
		const countryCode = businessProfile?.addresses?.[0]?.country?.toLowerCase?.() ?? this.fallbackCountryCode();

		this.intlTelInput = intlTelInput(this.inputElement().nativeElement, {
			initialCountry: 'auto',
			// @ts-ignore
			strictMode: true,
			separateDialCode: true,
			// @ts-ignore
			countryOrder: [countryCode],
			// @ts-ignore
			loadUtils: () => import("intl-tel-input/utils"),
			geoIpLookup: (callback) => callback(countryCode),
		});

		// @ts-ignore
		const {value} = this.control();
		if (is.string_not_empty<string>(value)) this.intlTelInput?.setNumber(value);

		this.inputElement().nativeElement.addEventListener('countrychange', () => {
			// @ts-ignore
			this.control().setValue(this.intlTelInput?.getNumber());
		});

		this.inputElement().nativeElement.addEventListener('input', () => {
			// @ts-ignore
			this.control().setValue(this.intlTelInput?.getNumber());
			// @ts-ignore
			if (!this.intlTelInput.isValidNumber()) this.control().setErrors({
				'invalid': true
			});

		});
	}

	public ngOnDestroy() {
		// @ts-ignore
		this.intlTelInput?.['destroy']?.();
	}

}
