import {inject, Injectable} from "@angular/core";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {IAbsence} from "@tenant/absence/domain/interface/i.absence";
import {SharedUow} from "@core/shared/uow/shared.uow";

@Injectable()
export class AbsenceTableNgxDatatableSmartResource extends TableNgxDatatableSmartResource<IAbsence.EntityRaw> {

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
