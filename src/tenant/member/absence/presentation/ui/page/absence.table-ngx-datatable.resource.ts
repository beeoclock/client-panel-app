import {inject, Injectable, signal} from "@angular/core";
import {
	AsyncLoadDataFunctionParams,
	FiltersType,
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {IAbsence} from "@tenant/member/absence/domain/interface/i.absence";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {FilterForm} from "@tenant/member/absence/presentation/form/filter.form";

@Injectable()
export class AbsenceTableNgxDatatableSmartResource extends TableNgxDatatableSmartResource<IAbsence.EntityRaw> {

	public override readonly filters = signal<FiltersType>((new FilterForm()).getRawValue() as any);

	private readonly sharedUow = inject(SharedUow);
	protected override readonly loadData = ({
		page,
		pageSize,
		orderBy,
		orderDir,
		filters
	}: AsyncLoadDataFunctionParams) => {

		return this.sharedUow.absence.repository.findAsync({
			page,
			pageSize,
			orderDir,
			orderBy,
			...filters,
		});

	}

}
