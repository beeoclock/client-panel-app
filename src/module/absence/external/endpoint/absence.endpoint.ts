import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export const AbsenceEndpoint = {
	CREATE: '/api/v1/absence',
	UPDATE: '/api/v1/absence/{id}',
	DELETE: '/api/v1/absence/{id}',
	DETAILS: '/api/v1/absence/{id}',
	PAGED: '/api/v1/absence/paged',
	ARCHIVE: '/api/v1/absence/{id}/archive',
	UNARCHIVE: '/api/v1/absence/{id}/unarchive',
}

export const absenceEndpoint: EndpointCollectionType = {
	PATCH: {
		[AbsenceEndpoint.ARCHIVE]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
		[AbsenceEndpoint.UNARCHIVE]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
	},
	POST: {
		[AbsenceEndpoint.CREATE]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		}
	},
	PUT: {
		[AbsenceEndpoint.UPDATE]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		}
	},
	DELETE: {
		[AbsenceEndpoint.DELETE]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		}
	},
	GET: {
		[AbsenceEndpoint.PAGED]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		},
		[AbsenceEndpoint.DETAILS]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		}
	},
}


Endpoint.registerEndpointCollection(absenceEndpoint);
