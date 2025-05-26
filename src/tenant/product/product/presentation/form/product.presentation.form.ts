import {FormControl, FormGroup} from "@angular/forms";
import {RIMedia} from "@tenant/media/domain/interface/i.media";
import {IProduct} from "@tenant/product/product/domain";

export interface IProductPresentationForm {
	images: FormControl<RIMedia[]>;
}

export class ProductPresentationForm extends FormGroup<IProductPresentationForm> {
	constructor(initialValue: Partial<Pick<IProduct.DTO, 'images'>> = {}) {
		super({
			images: new FormControl(),
		});
		this.patchValue(initialValue);
	}

}
