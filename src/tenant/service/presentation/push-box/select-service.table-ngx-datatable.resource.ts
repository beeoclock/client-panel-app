import {inject, Injectable} from "@angular/core";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IService} from "@tenant/service/domain/interface/i.service";

@Injectable()
export class SelectServiceTableNgxDatatableResource extends TableNgxDatatableSmartResource<IService.EntityRaw> {

	private readonly sharedUow = inject(SharedUow);
	protected override loadData (parameters: AsyncLoadDataFunctionParams) {

		if (parameters.orderBy === 'fullName') {
			parameters.orderBy = 'firstName';
		}


		return this.sharedUow.service.repository.findAsync(parameters);

	}

}
