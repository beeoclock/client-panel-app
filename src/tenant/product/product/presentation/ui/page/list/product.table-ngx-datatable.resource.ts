import {inject, Injectable, signal} from "@angular/core";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IProduct} from "@tenant/product/product/domain";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {z} from "zod";
import {FilterForm} from "@tenant/service/presentation/form";

@Injectable()
export class ProductTableNgxDatatableSmartResource extends TableNgxDatatableSmartResource<IProduct.EntityRaw> {

	public override formValue() {
		const additional = z.object({

			phrase: z.coerce.string().optional(),
			state: z.array(z.coerce.string()).optional(),

		});
		return super.formValue().merge(additional);
	}

	public override getNewForm() {
		return new FilterForm();
	}

	public override readonly useQueryParams = true;
	public override readonly defaultParameters = this.parseQueryParams(this.queryParams());
	public override readonly parameters = signal<AsyncLoadDataFunctionParams>(this.defaultParameters);


	private readonly sharedUow = inject(SharedUow);
	protected override loadData(parameters: AsyncLoadDataFunctionParams) {

		return this.sharedUow.product.repository.findAsync(parameters);

	}

}
