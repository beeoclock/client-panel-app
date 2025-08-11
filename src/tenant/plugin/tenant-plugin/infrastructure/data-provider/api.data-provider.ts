import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {Types} from "@core/shared/types";
import {PagedApi} from "@tenant/plugin/tenant-plugin/infrastructure/data-source/api/paged.api";
import {AttachPluginApi} from "@tenant/plugin/tenant-plugin/infrastructure/data-source/api/attach-plugin.api";
import {DetachPluginApi} from "@tenant/plugin/tenant-plugin/infrastructure/data-source/api/detach-plugin.api";
import {ExecuteFunctionApi} from "@tenant/plugin/tenant-plugin/infrastructure/data-source/api/execute-function.api";
import {ITenantPlugin} from "@tenant/plugin/tenant-plugin/domain";
import { of } from "rxjs";

@Injectable()
export class ApiDataProvider extends DataProvider<ITenantPlugin.DTO> {

	private readonly allTenantPluginsApi = inject(PagedApi);
	private readonly attachPluginApi = inject(AttachPluginApi);
	private readonly detachPluginApi = inject(DetachPluginApi);
	private readonly executeFunctionApi = inject(ExecuteFunctionApi);


	/**
	 *
	 * @param options
	 */
	public override find$(options: Types.FindQueryParams) {
		return this.allTenantPluginsApi.execute$(options);
	}

	public override create$(data: ITenantPlugin.DTO) {
		return of(data);
	}

	public override update$(data: ITenantPlugin.DTO) {
		return of(data);
	}

}
