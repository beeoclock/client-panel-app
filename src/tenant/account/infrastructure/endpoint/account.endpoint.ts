import {Endpoint, EndpointCollectionType} from "@shared/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";
import {TranslateService} from "@ngx-translate/core";

export enum accountEndpointEnum {
    accountFrontendSettingsBusinessPanelLanguage = '/api/v1/account/frontend-settings/business-panel/language',
    accountFrontendSettingsBusinessPanelTheme = '/api/v1/account/frontend-settings/business-panel/theme',
    getFrontendSettings = '/api/v1/account/frontend-settings',
}

export const accountEndpoint: EndpointCollectionType = {
    GET: {
        [accountEndpointEnum.getFrontendSettings]: {
            source: SourceNetworkEnum.identity,
            header: {
                authorization: true,
                tenantId: true,
            },
        },
    },
    PUT: {
        [accountEndpointEnum.accountFrontendSettingsBusinessPanelLanguage]: {
            source: SourceNetworkEnum.identity,
            header: {
                authorization: true,
                tenantId: true,
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
            source: SourceNetworkEnum.identity,
            header: {
                authorization: true,
                tenantId: true,
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
