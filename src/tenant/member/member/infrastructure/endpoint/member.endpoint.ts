import {Endpoint, EndpointCollectionType} from "@shared/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";

export enum memberEndpointEnum {
    paged = '/api/v1/member/paged',
    item = '/api/v1/member/{id}',
    update = '/api/v1/member/{id}',
    delete = '/api/v1/member/{id}',
    archive = '/api/v1/member/{id}/archive',
    create = '/api/v1/member',
}

export const memberEndpoint: EndpointCollectionType = {
    GET: {
        [memberEndpointEnum.item]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
				tenantId: true,
            }
        },
        [memberEndpointEnum.paged]: {
            source: SourceNetworkEnum.panel,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
    },
    POST: {
        [memberEndpointEnum.create]: {
            source: SourceNetworkEnum.panel,
            header: {
                authorization: true,
				tenantId: true,
            }
        }
    },
    PUT: {
        [memberEndpointEnum.update]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
				tenantId: true,
            }
        },
    },
    PATCH: {
        [memberEndpointEnum.archive]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
				tenantId: true,
            }
        },
    },
    DELETE: {
        [memberEndpointEnum.delete]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
				tenantId: true,
            }
        },
    },
}


Endpoint.registerEndpointCollection(memberEndpoint);
