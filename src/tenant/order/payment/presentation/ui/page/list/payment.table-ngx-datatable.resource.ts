import {inject, Injectable, signal} from "@angular/core";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IPayment} from "@tenant/order/payment/domain/interface/i.payment";
import {
	AsyncLoadDataFunctionParams,
	FiltersType,
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {FilterForm} from "@tenant/order/payment/presentation/form/filter.form";

@Injectable()
export class PaymentTableNgxDatatableResource extends TableNgxDatatableSmartResource<IPayment.EntityRaw> {

	private readonly sharedUow = inject(SharedUow);
	public override readonly filters = signal<FiltersType>((new FilterForm()).getRawValue() as any);

	protected override readonly loadData = ({
												page,
												pageSize,
												orderBy,
												orderDir,
												filters
											}: AsyncLoadDataFunctionParams) => {

		return this.sharedUow.payment.repository.findAsync({
			page,
			pageSize,
			orderDir,
			orderBy,
			...filters,
		});

	}

}
