import {inject, Injectable} from "@angular/core";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartResource
} from "@shared/presentation/ui/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IPlugin} from "@tenant/plugin/plugin/domain";

@Injectable()
export class PluginTableNgxDatatableResource extends TableNgxDatatableSmartResource<IPlugin.EntityRaw> {

	private readonly sharedUow = inject(SharedUow);
	protected override readonly loadData = (parameters: AsyncLoadDataFunctionParams) => {

		return this.sharedUow.plugin.repository.findAsync(parameters);

	}

}
