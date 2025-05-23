import {IPlugin} from "@tenant/plugin/plugin/domain";

export class SetTenantPluginDto {
	public readonly object = 'SetTenantPluginDto';
	public constructor(
		public readonly plugin: IPlugin.DTO,
	) {
	}
}
