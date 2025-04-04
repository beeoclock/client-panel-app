import {inject, Injectable} from "@angular/core";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IMember} from "@tenant/member/domain";

@Injectable()
export class MemberTableNgxDatatableSmartResource extends TableNgxDatatableSmartResource<IMember.EntityRaw> {

	private readonly sharedUow = inject(SharedUow);
	protected override readonly loadData = ({
												page,
												pageSize,
												orderBy,
												orderDir,
												filters
											}: AsyncLoadDataFunctionParams) => {

		return this.sharedUow.member.repository.findAsync({
			page,
			pageSize,
			orderDir,
			orderBy,
			...filters,
		});

	}

}
