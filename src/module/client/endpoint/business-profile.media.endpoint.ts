import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
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
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[businessProfileMediaEndpointEnum.getBanners]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[businessProfileMediaEndpointEnum.getLogo]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			}
		}
	},
	PATCH: {
		[businessProfileMediaEndpointEnum.patchGallery]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[businessProfileMediaEndpointEnum.patchBanners]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[businessProfileMediaEndpointEnum.patchLogo]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
	},
	DELETE: {
		[businessProfileMediaEndpointEnum.deleteGallery]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[businessProfileMediaEndpointEnum.deleteBanners]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[businessProfileMediaEndpointEnum.deleteLogo]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
	},
}


Endpoint.registerEndpointCollection(businessProfileMediaEndpoint);
