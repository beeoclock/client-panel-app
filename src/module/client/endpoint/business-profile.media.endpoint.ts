import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum businessProfileMediaEndpointEnum {
	// Gallery
	getGallery = '/api/v1/business-profile-media/gallery',
	patchGallery = '/api/v1/business-profile-media/gallery',
	deleteGallery = '/api/v1/business-profile-media/{id}/gallery',

	// Banner
	getBanners = '/api/v1/business-profile-media/banners',
	patchBanners = '/api/v1/business-profile-media/banners',
	deleteBanners = '/api/v1/business-profile-media/{id}/banners',

	// Logo
	getLogo = '/api/v1/business-profile-media/logo',
	patchLogo = '/api/v1/business-profile-media/logo',
	deleteLogo = '/api/v1/business-profile-media/logo',
}

export const businessProfileMediaEndpoint: EndpointCollectionType = {
	GET: {
		[businessProfileMediaEndpointEnum.getGallery]: {
			path: businessProfileMediaEndpointEnum.getGallery,
			method: RequestMethodEnum.GET,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		},
		[businessProfileMediaEndpointEnum.getBanners]: {
			path: businessProfileMediaEndpointEnum.getBanners,
			method: RequestMethodEnum.GET,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		},
		[businessProfileMediaEndpointEnum.getLogo]: {
			path: businessProfileMediaEndpointEnum.getLogo,
			method: RequestMethodEnum.GET,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		}
	},
	PATCH: {
		[businessProfileMediaEndpointEnum.patchGallery]: {
			path: businessProfileMediaEndpointEnum.patchGallery,
			method: RequestMethodEnum.PATCH,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		},
		[businessProfileMediaEndpointEnum.patchBanners]: {
			path: businessProfileMediaEndpointEnum.patchBanners,
			method: RequestMethodEnum.PATCH,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		},
		[businessProfileMediaEndpointEnum.patchLogo]: {
			path: businessProfileMediaEndpointEnum.patchLogo,
			method: RequestMethodEnum.PATCH,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		},
	},
	DELETE: {
		[businessProfileMediaEndpointEnum.deleteGallery]: {
			path: businessProfileMediaEndpointEnum.deleteGallery,
			method: RequestMethodEnum.DELETE,
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
		[businessProfileMediaEndpointEnum.deleteBanners]: {
			path: businessProfileMediaEndpointEnum.deleteBanners,
			method: RequestMethodEnum.DELETE,
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
		[businessProfileMediaEndpointEnum.deleteLogo]: {
			path: businessProfileMediaEndpointEnum.deleteLogo,
			method: RequestMethodEnum.DELETE,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		},
	},
}


Endpoint.registerEndpointCollection(businessProfileMediaEndpoint);
