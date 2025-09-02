import {IBaseDTO, IBaseEntityRaw} from "@shared/domain";
import {Tools} from "@core/shared/tools";
import {IPlugin} from "@tenant/plugin/plugin/domain";

export enum TenantPluginStatusEnum {
	inTrialPeriod = 'inTrialPeriod',
	onboardingPending = 'onboardingPending',
	connected = 'connected',
	disconnected = 'disconnected'
}

export namespace ITenantPlugin {

	export interface DTO extends IBaseDTO<'TenantPluginDto'> {
		plugin: IPlugin.DTO;
		config: object;
		status: TenantPluginStatusEnum;
	}

	export type EntityRaw = IBaseEntityRaw<'TenantPluginDto'> & DTO & {};

}

export const isTenantPlugin = Tools.createIs<ITenantPlugin.DTO>();
export const validTenantPlugin = Tools.createValidate<ITenantPlugin.DTO>();
export const randomTenantPlugin = Tools.createRandom<ITenantPlugin.DTO>();
