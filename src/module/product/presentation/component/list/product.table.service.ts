import { Injectable } from '@angular/core';
import { TableService } from '@utility/table.service';
import * as Product from "@product/domain";
import { ProductActions } from '@product/state/product/product.actions';

@Injectable()
export class ProductTableService extends TableService<Product.IProduct> {
	public override readonly actions = ProductActions;
}
