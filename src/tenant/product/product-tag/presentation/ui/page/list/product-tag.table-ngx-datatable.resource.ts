import {inject, Injectable, signal} from "@angular/core";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IProductTag} from "@tenant/product/product-tag/domain";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {z} from "zod";
import {FilterForm} from "@tenant/service/presentation/form";

@Injectable()
export class ProductTagTableNgxDatatableSmartResource extends TableNgxDatatableSmartResource<IProductTag.EntityRaw> {

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

		return this.sharedUow.productTag.repository.findAsync(parameters);

	}

}
