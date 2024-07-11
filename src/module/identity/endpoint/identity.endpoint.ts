import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum identityEndpointEnum {
    postCreateUser = '/api/v1/provider/create-user',
    postCreateUserAndBusinessClient = '/api/v1/provider/create-user-and-business-client',
    postCreateBusinessClient = '/api/v1/provider/create-business-client',
    patchSwitchBusinessClient = '/api/v1/provider/switch-business-client',
    postResetPassword = '/api/v1/provider/reset-password',
    confirmEmail = '/api/v1/provider/confirm-email',
    confirmInvitation = '/api/v1/provider/confirm-invitation',
    postRegisterDevice = '/api/v1/provider/register-device',

    patchChangeName = '/api/v1/provider/name',
    patchChangePhoneNumber = '/api/v1/provider/phone-number',
}

export const identityEndpoint: EndpointCollectionType = {
    POST: {
        [identityEndpointEnum.confirmInvitation]: {
            source: SourceNetworkEnum.identity
        },
        [identityEndpointEnum.postResetPassword]: {
            source: SourceNetworkEnum.identity
        },
        [identityEndpointEnum.postCreateUser]: {
            source: SourceNetworkEnum.identity
        },
        [identityEndpointEnum.postCreateUserAndBusinessClient]: {
            source: SourceNetworkEnum.identity
        },
        [identityEndpointEnum.confirmEmail]: {
            source: SourceNetworkEnum.identity,
            header: {
                authorization: true
            }
        },
        [identityEndpointEnum.postCreateBusinessClient]: {
            source: SourceNetworkEnum.identity,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
        [identityEndpointEnum.postRegisterDevice]: {
            source: SourceNetworkEnum.identity,
            header: {
                authorization: true,
                tenantId: true,
            }
        }
    },
    PATCH: {
        [identityEndpointEnum.patchSwitchBusinessClient]: {
            source: SourceNetworkEnum.identity,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
        [identityEndpointEnum.patchChangeName]: {
            source: SourceNetworkEnum.identity,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
        [identityEndpointEnum.patchChangePhoneNumber]: {
            source: SourceNetworkEnum.identity,
            header: {
                authorization: true,
                tenantId: true,
            }
        }
    }
}


Endpoint.registerEndpointCollection(identityEndpoint);
