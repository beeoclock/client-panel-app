import {inject, Injectable} from "@angular/core";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartResource
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IProduct} from "@tenant/product/domain";

@Injectable()
export class ProductTableNgxDatatableSmartResource extends TableNgxDatatableSmartResource<IProduct.EntityRaw> {

	private readonly sharedUow = inject(SharedUow);
	protected override readonly loadData = ({
												page,
												pageSize,
												orderBy,
												orderDir,
												filters
											}: AsyncLoadDataFunctionParams) => {

		return this.sharedUow.product.repository.findAsync({
			page,
			pageSize,
			orderDir,
			orderBy,
			...filters,
		});

	}

}
