import {FormControl,} from '@angular/forms';
import {BaseEntityForm} from "@shared/base.form";
import {IProductTag} from "@tenant/product/product-tag/domain";


export interface IProductTagForm {
	name: FormControl<string>;
}

export class ProductTagForm extends BaseEntityForm<'ProductTagDto', IProductTagForm> {
	constructor(initialValue: Partial<IProductTag.DTO> = {}) {
		super('ProductTagDto', {
			name: new FormControl(),
		});
		this.patchValue(initialValue);
	}
}
