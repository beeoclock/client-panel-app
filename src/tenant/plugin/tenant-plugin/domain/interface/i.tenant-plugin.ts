import {IBaseDTO, IBaseEntityRaw} from "@shared/domain";
import {Tools} from "@core/shared/tools";
import {IPlugin} from "@tenant/plugin/plugin/domain";

export namespace ITenantPlugin {

	export interface DTO extends IBaseDTO<'TenantPluginDto'> {
		plugin: IPlugin.DTO;
		config: object;
		status: string;
	}

	export type EntityRaw = IBaseEntityRaw<'TenantPluginDto'> & DTO & {};

}

export const isTenantPlugin = Tools.createIs<ITenantPlugin.DTO>();
export const validTenantPlugin = Tools.createValidate<ITenantPlugin.DTO>();
export const randomTenantPlugin = Tools.createRandom<ITenantPlugin.DTO>();
