import {inject, Injectable, signal} from "@angular/core";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IOrderService} from "@tenant/order-service/domain/interface/i.order-service.dto";
import {FilterForm} from "@tenant/order-service/presentation/form/filter.form";
import {
	AsyncLoadDataFunctionParams,
	FiltersType,
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";

@Injectable()
export class OrderServiceTableNgxDatatableResource extends TableNgxDatatableSmartResource<IOrderService.EntityRaw> {

	public override readonly filters = signal<FiltersType>((new FilterForm()).getRawValue() as any);

	private readonly sharedUow = inject(SharedUow);
	protected override readonly loadData = ({
												page,
												pageSize,
												orderBy,
												orderDir,
												filters
											}: AsyncLoadDataFunctionParams) => {

		return this.sharedUow.orderService.repository.findAsync({
			page,
			pageSize,
			orderDir,
			orderBy,
			...filters,
		});

	}

}
