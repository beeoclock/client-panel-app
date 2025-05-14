import {inject, Injectable, signal} from "@angular/core";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IOrderService} from "@tenant/order/order-service/domain/interface/i.order-service.dto";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {z} from 'zod';
import {IntervalTypeEnum} from "@tenant/analytic/domain/enum/interval.enum";
import {FilterForm} from "@tenant/order/order-service/presentation/form/filter.form";

@Injectable()
export class OrderServiceTableNgxDatatableResource extends TableNgxDatatableSmartResource<IOrderService.EntityRaw> {

	public override formValue() {
		const additional = z.object({

			phrase: z.coerce.string().optional(),
			state: z.array(z.coerce.string()).optional(),
			members: z.array(z.coerce.string()).optional(),
			services: z.array(z.coerce.string()).optional(),
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

		return this.sharedUow.orderService.repository.findAsync(parameters);

	}

}
