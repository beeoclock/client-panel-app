import {inject, Injectable, signal} from "@angular/core";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartResource
} from "@shared/presentation/ui/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IMember} from "@tenant/member/member/domain";
import {z} from "zod";
import {FilterForm} from "@tenant/member/member/presentation/form/filter.form";

@Injectable()
export class MemberTableNgxDatatableSmartResource extends TableNgxDatatableSmartResource<IMember.EntityRaw> {

	public override formValue() {
		const additional = z.object({

			phrase: z.coerce.string().optional(),

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

		return this.sharedUow.member.repository.findAsync(parameters);

	}

}
