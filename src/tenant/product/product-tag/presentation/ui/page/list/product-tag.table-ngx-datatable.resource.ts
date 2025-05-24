import {inject, Injectable} from "@angular/core";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IProductTag} from "@tenant/product/product-tag/domain";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";

@Injectable()
export class ProductTagTableNgxDatatableSmartResource extends TableNgxDatatableSmartResource<IProductTag.EntityRaw> {

	private readonly sharedUow = inject(SharedUow);

	protected override loadData(parameters: AsyncLoadDataFunctionParams) {

		return this.sharedUow.productTag.repository.findAsync(parameters);

	}

}
