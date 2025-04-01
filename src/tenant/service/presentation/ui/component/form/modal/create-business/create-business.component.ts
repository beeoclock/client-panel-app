import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {ServiceForm} from "@tenant/service/presentation/form";
import {PricesBlockComponent} from "@tenant/service/presentation/ui/component/form/v2/prices/prices-block.component";
import {ServicesFormComponent} from "@tenant/service/presentation/ui/component/form/v2/service/services.form.component";
import {CurrencyCodeEnum, LanguageCodeEnum} from "@core/shared/enum";

@Component({
	selector: 'service-create-business-component',
	templateUrl: './create-business.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		PricesBlockComponent,
		ServicesFormComponent,
	],
	standalone: true
})
export class CreateBusinessComponent implements OnInit {
	public readonly form = new ServiceForm();
	public readonly availableLanguages: LanguageCodeEnum[] = [];
	public readonly baseLanguage!: LanguageCodeEnum;
	public readonly currencies: CurrencyCodeEnum[] = [];
	public readonly baseCurrency!: CurrencyCodeEnum;

	public get currencyOptionList(): {
		id: CurrencyCodeEnum;
		name: CurrencyCodeEnum;
	}[] {
		return Array.from(new Set([...this.currencies, this.baseCurrency])).map((currency) => {
			return {
				id: currency,
				name: currency
			};
		});
	}

	public ngOnInit() {
		this.form.controls.durationVersions.controls.forEach((durationVersion) => {
			durationVersion.controls.prices.controls.forEach((price) => {
				price.controls.currency.setValue(this.baseCurrency);
			});
		});
	}

	public async submit(): Promise<ServiceForm> {
		if (this.form.invalid) {
			return Promise.reject();
		}
		return Promise.resolve(this.form);
	}
}
