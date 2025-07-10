import {InjectionToken} from "@angular/core";

export interface IRoleConfigurationCardList {
	showSelectedStatus: boolean;
}

export const ROLE_CONFIG_CARD_LIST = new InjectionToken<IRoleConfigurationCardList>('ROLE_CONFIG_CARD_LIST');

export const buildRoleConfigCardListToken = (config: IRoleConfigurationCardList) => ({
	provide: ROLE_CONFIG_CARD_LIST,
	useValue: config,
});
