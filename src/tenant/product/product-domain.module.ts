import {importProvidersFrom, NgModule} from "@angular/core";
import {ProductModule} from "@tenant/product/product/product.module";
import {ProductTagModule} from "@tenant/product/product-tag/product-tag.module";

@NgModule({
	providers: [
		importProvidersFrom(
			ProductModule,
			ProductTagModule,
		)
	]
})
export class ProductDomainModule {


}
