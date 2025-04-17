import {inject, Injectable, signal} from "@angular/core";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IService} from "@tenant/service/domain/interface/i.service";
import {z} from "zod";
import {FilterForm} from "@tenant/service/presentation/form/filter.form";

@Injectable()
export class ServiceTableNgxDatatableSmartResource extends TableNgxDatatableSmartResource<IService.EntityRaw> {

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

		if (parameters.orderBy === 'fullName') {
			parameters.orderBy = 'firstName';
		}

		return this.sharedUow.service.repository.findAsync(parameters);

	}

}
