import {inject, Injectable, signal} from "@angular/core";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {IAbsence} from "@tenant/member/absence/domain/interface/i.absence";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {FilterForm} from "@tenant/member/absence/presentation/form/filter.form";
import {z} from "zod";
import {IntervalTypeEnum} from "@tenant/analytic/domain/enum/interval.enum";

@Injectable()
export class AbsenceTableNgxDatatableSmartResource extends TableNgxDatatableSmartResource<IAbsence.EntityRaw> {

	public override formValue() {
		const additional = z.object({

			phrase: z.coerce.string().optional(),
			state: z.array(z.coerce.string()).optional(),
			members: z.array(z.coerce.string()).optional(),
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

		return this.sharedUow.absence.repository.findAsync(parameters);

	}

}
