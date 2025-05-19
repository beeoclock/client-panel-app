import EPlugin from "@tenant/plugin/plugin/domain/entity/e.plugin-store";
import {AttachPluginApi} from "@tenant/plugin/tenant-plugin/infrastructure/data-source/api/attach-plugin.api";
import ETenantPlugin from "@tenant/plugin/tenant-plugin/domain/entity/e.tenant-plugin";
import {SetTenantPluginDto} from "@tenant/plugin/tenant-plugin/domain/dto/set-tenant-plugin.dto";

export class AttachPluginUseCase {
	public constructor(
		private readonly attachPluginApi: AttachPluginApi,
	) {
	}

	public async execute(item: ETenantPlugin): Promise<void> {
		const plugin = EPlugin.fromDTO(item.plugin);
		const setTenantPluginDto = new SetTenantPluginDto(plugin)
		await this.attachPluginApi.executeAsync(setTenantPluginDto);
	}
}
