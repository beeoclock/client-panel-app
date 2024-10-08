import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	Input,
	OnInit,
	ViewEncapsulation
} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {CountryCodeEnum} from "@utility/domain/enum/country-code.enum";
import {Reactive} from "@utility/cdk/reactive";

@Component({
	selector: 'country-select-component',
	standalone: true,
	template: `
		<label default [for]="id">
			{{ 'keyword.capitalize.country' | translate }}
		</label>
		<ng-select
			bindLabel="name"
			bindValue="code"
			[items]="countryList"
			[clearable]="false"
			[id]="id"
			[formControl]="control">
		</ng-select>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
		DefaultLabelDirective
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceAndCurrencyComponent extends Reactive implements OnInit {

	@Input()
	public id = '';

	@Input()
	public control = new FormControl();

	public readonly translateService = inject(TranslateService);
	public readonly changeDetectorRef = inject(ChangeDetectorRef);

	public countryList: { name: string; code: string; }[] = [];

	public ngOnInit(): void {

		this.updateCountryList();
		this.translateService.onLangChange.pipe(this.takeUntil()).subscribe(() => {
			this.updateCountryList();
		});

		if (!this.control.value) {

			this.control.patchValue(CountryCodeEnum.UA);
			this.changeDetectorRef.detectChanges();

		}

	}

	public updateCountryList(): void {
		const countryTranslateMap = this.translateService.instant('country');

		this.countryList = Object.keys(CountryCodeEnum).map((countryCode) => {
			return {
				name: countryTranslateMap[countryCode as keyof typeof CountryCodeEnum],
				code: countryCode
			};
		});
	}

}
