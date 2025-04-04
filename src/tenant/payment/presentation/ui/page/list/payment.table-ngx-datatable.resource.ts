import {inject, Injectable} from "@angular/core";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IPayment} from "@tenant/payment/domain/interface/i.payment";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";

@Injectable()
export class PaymentTableNgxDatatableResource extends TableNgxDatatableSmartResource<IPayment.EntityRaw> {

	private readonly sharedUow = inject(SharedUow);
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
