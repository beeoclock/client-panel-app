import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";
import {TranslateService} from "@ngx-translate/core";

export enum accountEndpointEnum {
	accountFrontendSettingsBusinessPanelLanguage = '/api/v1/account/frontend-settings/business-panel/language',
	accountFrontendSettingsBusinessPanelTheme = '/api/v1/account/frontend-settings/business-panel/theme',
	getFrontendSettings = '/api/v1/account/frontend-settings',
}

export const accountEndpoint: EndpointCollectionType = {
	GET: {
		[accountEndpointEnum.getFrontendSettings]: {
			path: accountEndpointEnum.getFrontendSettings,
			method: RequestMethodEnum.GET,
			source: SourceNetworkEnum.identity,
			header: {
				authorization: true,
			},
		},
	},
	PUT: {
		[accountEndpointEnum.accountFrontendSettingsBusinessPanelLanguage]: {
			path: accountEndpointEnum.accountFrontendSettingsBusinessPanelLanguage,
			method: RequestMethodEnum.PUT,
			source: SourceNetworkEnum.identity,
			header: {
				authorization: true,
			},
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.PUT.${accountEndpointEnum.accountFrontendSettingsBusinessPanelLanguage}.after.success`;
							const {title, message} = translateService.instant(key);
							return {
								title,
								message
							}
						},
					},
				},
			},
		},
		[accountEndpointEnum.accountFrontendSettingsBusinessPanelTheme]: {
			path: accountEndpointEnum.accountFrontendSettingsBusinessPanelTheme,
			method: RequestMethodEnum.PUT,
			source: SourceNetworkEnum.identity,
			header: {
				authorization: true,
			},
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.PUT.${accountEndpointEnum.accountFrontendSettingsBusinessPanelTheme}.after.success`;
							const {title, message} = translateService.instant(key);
							return {
								title,
								message
							}
						},
					},
				},
			},
		},
	},
}

Endpoint.registerEndpointCollection(accountEndpoint);
