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
import {CountryEnum} from "@utility/domain/enum/country.enum";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {CountryCodeEnum} from "@utility/domain/enum/country-code.enum";

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
export class PriceAndCurrencyComponent implements OnInit {

	@Input()
	public id = '';

	@Input()
	public control = new FormControl();

	public readonly translateService = inject(TranslateService);
	public readonly changeDetectorRef = inject(ChangeDetectorRef);

	private readonly countryTranslateMap: { [key in keyof typeof CountryEnum]: string };

	public readonly countryList: { name: any; code: string; }[] = [];

	constructor() {

		this.countryTranslateMap = this.translateService.instant('country');

		this.countryList = Object.keys(CountryEnum).map((countryCode) => {
			return {
				name: this.countryTranslateMap[countryCode as keyof typeof CountryEnum],
				code: countryCode
			};
		})

	}

	public ngOnInit(): void {

		if (!this.control.value) {

			this.control.patchValue(CountryCodeEnum.UA);
			this.changeDetectorRef.detectChanges();

		}

	}

}
