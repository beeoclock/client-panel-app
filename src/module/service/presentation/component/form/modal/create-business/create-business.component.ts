import {Component, ViewEncapsulation} from "@angular/core";
import {ServiceForm} from "@service/presentation/form";
import {DetailsBlockComponent} from "@service/presentation/component/form/v2/details/details-block.component";
import {PricesBlockComponent} from "@service/presentation/component/form/v2/prices/prices-block.component";

@Component({
	selector: 'service-create-business-component',
	templateUrl: './create-business.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		DetailsBlockComponent,
		PricesBlockComponent
	],
	standalone: true
})
export class CreateBusinessComponent {
	public readonly form = new ServiceForm();

	public async submit(): Promise<ServiceForm> {
		if (this.form.invalid) {
			return Promise.reject();
		}
		return Promise.resolve(this.form);
	}
}
