import ETenantPlugin from "@tenant/plugin/tenant-plugin/domain/entity/e.tenant-plugin";
import {DetachPluginApi} from "@tenant/plugin/tenant-plugin/infrastructure/data-source/api/detach-plugin.api";

export class DetachPluginUseCase {
	public constructor(
		private readonly detachPluginApi: DetachPluginApi,
	) {
	}

	public async execute(item: ETenantPlugin): Promise<void> {
		await this.detachPluginApi.executeAsync(item.plugin.slug);
	}
}
