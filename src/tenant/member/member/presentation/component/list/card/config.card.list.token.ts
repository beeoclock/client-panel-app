import {InjectionToken} from "@angular/core";

export interface IMemberConfigurationCardList {
	showSelectedStatus: boolean;
}

export const MEMBER_CONFIG_CARD_LIST = new InjectionToken<IMemberConfigurationCardList>('MEMBER_CONFIG_CARD_LIST');

export const buildMemberConfigCardListToken = (config: IMemberConfigurationCardList) => ({
	provide: MEMBER_CONFIG_CARD_LIST,
	useValue: config,
});
