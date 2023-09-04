import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum clientMediaEndpointEnum {
	// Gallery
	getGallery = '/api/v1/client-media/gallery',
	patchGallery = '/api/v1/client-media/gallery',
	deleteGallery = '/api/v1/client-media/{id}/gallery',

	// Banner
	getBanners = '/api/v1/client-media/banners',
	patchBanners = '/api/v1/client-media/banners',
	deleteBanners = '/api/v1/client-media/{id}/banners',

	// Logo
	getLogo = '/api/v1/client-media/logo',
	patchLogo = '/api/v1/client-media/logo',
	deleteLogo = '/api/v1/client-media/logo',
}

export const clientMediaEndpoint: EndpointCollectionType = {
	GET: {
		[clientMediaEndpointEnum.getGallery]: {
			path: clientMediaEndpointEnum.getGallery,
			method: RequestMethodEnum.GET,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		},
		[clientMediaEndpointEnum.getBanners]: {
			path: clientMediaEndpointEnum.getBanners,
			method: RequestMethodEnum.GET,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		},
		[clientMediaEndpointEnum.getLogo]: {
			path: clientMediaEndpointEnum.getLogo,
			method: RequestMethodEnum.GET,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		}
	},
	PATCH: {
		[clientMediaEndpointEnum.patchGallery]: {
			path: clientMediaEndpointEnum.patchGallery,
			method: RequestMethodEnum.PATCH,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		},
		[clientMediaEndpointEnum.patchBanners]: {
			path: clientMediaEndpointEnum.patchBanners,
			method: RequestMethodEnum.PATCH,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		},
		[clientMediaEndpointEnum.patchLogo]: {
			path: clientMediaEndpointEnum.patchLogo,
			method: RequestMethodEnum.PATCH,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		},
	},
	DELETE: {
		[clientMediaEndpointEnum.deleteGallery]: {
			path: clientMediaEndpointEnum.deleteGallery,
			method: RequestMethodEnum.DELETE,
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
		[clientMediaEndpointEnum.deleteBanners]: {
			path: clientMediaEndpointEnum.deleteBanners,
			method: RequestMethodEnum.DELETE,
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
		[clientMediaEndpointEnum.deleteLogo]: {
			path: clientMediaEndpointEnum.deleteLogo,
			method: RequestMethodEnum.DELETE,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		},
	},
}


Endpoint.registerEndpointCollection(clientMediaEndpoint);
