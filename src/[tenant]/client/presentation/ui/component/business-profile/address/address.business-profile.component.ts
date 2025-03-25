import {Component, Input, input, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {AddressForm} from "@[tenant]/client/presentation/form/address.form";
import {PriceAndCurrencyComponent} from "@utility/presentation/component/input/country.component";

@Component({
	selector: 'client-address-business-profile-component',
	templateUrl: './address.business-profile.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		TranslateModule,
		FormInputComponent,
		PriceAndCurrencyComponent
	],
	standalone: true
})
export class AddressBusinessProfileComponent {

	@Input()
	public form!: AddressForm;

	public readonly hideInputList = input<('country' | 'city' | 'zipCode' | 'addressLineOne' | 'addressLineTwo' | 'customLink')[]>([]);

}
