import {inject, Injectable, signal} from "@angular/core";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IPayment} from "@tenant/order/payment/domain/interface/i.payment";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartResource
} from "@shared/presentation/ui/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {FilterForm} from "@tenant/order/payment/presentation/form/filter.form";
import {z} from "zod";
import {IntervalTypeEnum} from "@tenant/analytic/domain/enum/interval.enum";

@Injectable()
export class PaymentTableNgxDatatableResource extends TableNgxDatatableSmartResource<IPayment.EntityRaw> {


	public override formValue() {
		const additional = z.object({

			phrase: z.coerce.string().optional(),
			statuses: z.array(z.coerce.string()).optional(),
			dateRange: z.object({
				interval: z.coerce.string().default(IntervalTypeEnum.day),
				selectedDate: z.coerce.string().default(new Date().toISOString()),
			}).optional(),

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

		return this.sharedUow.payment.repository.findAsync(parameters);

	}

}
