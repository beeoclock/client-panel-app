import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";
import {TranslateService} from "@ngx-translate/core";

export enum eventEndpointEnum {
	paged = '/api/v1/event/paged',
	mergedPaged = '/api/v1/event/merged-paged',
	slots = '/api/v1/event/slots',
	item = '/api/v1/event/{id}',
	update = '/api/v1/event/{id}',
	delete = '/api/v1/event/{id}',
	archive = '/api/v1/event/{id}/archive',
	booked = '/api/v1/event/{id}/booked',
	requested = '/api/v1/event/{id}/requested',
	cancelled = '/api/v1/event/{id}/cancelled',
	done = '/api/v1/event/{id}/done',
	create = '/api/v1/event',
}

export const eventEndpoint: EndpointCollectionType = {
	GET: {
		[eventEndpointEnum.item]: {
			path: eventEndpointEnum.item,
			method: RequestMethodEnum.GET,
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
		[eventEndpointEnum.paged]: {
			path: eventEndpointEnum.paged,
			method: RequestMethodEnum.GET,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true
			}
		},
		[eventEndpointEnum.mergedPaged]: {
			path: eventEndpointEnum.mergedPaged,
			method: RequestMethodEnum.GET,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true
			}
		},
		[eventEndpointEnum.slots]: {
			path: eventEndpointEnum.slots,
			method: RequestMethodEnum.GET,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true
			}
		},
	},
	POST: {
		[eventEndpointEnum.create]: {
			path: eventEndpointEnum.create,
			method: RequestMethodEnum.POST,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			},
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.POST.${eventEndpointEnum.create}.after.success`;
							const {title, message} = translateService.instant(key);
							return {
								title,
								message
							}
						}
					}
				}
			}
		}
	},
	PUT: {
		[eventEndpointEnum.update]: {
			path: eventEndpointEnum.update,
			method: RequestMethodEnum.PUT,
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
	},
	PATCH: {
		[eventEndpointEnum.archive]: {
			path: eventEndpointEnum.archive,
			method: RequestMethodEnum.PATCH,
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
		[eventEndpointEnum.booked]: {
			path: eventEndpointEnum.booked,
			method: RequestMethodEnum.PATCH,
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			},
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.PATCH.${eventEndpointEnum.booked}.after.success`;
							const {title, message} = translateService.instant(key);
							return {
								title,
								message
							}
						}
					}
				}
			}
		},
		[eventEndpointEnum.requested]: {
			path: eventEndpointEnum.requested,
			method: RequestMethodEnum.PATCH,
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			},
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.PATCH.${eventEndpointEnum.requested}.after.success`;
							const {title, message} = translateService.instant(key);
							return {
								title,
								message
							}
						}
					}
				}
			}
		},
		[eventEndpointEnum.cancelled]: {
			path: eventEndpointEnum.cancelled,
			method: RequestMethodEnum.PATCH,
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			},
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.PATCH.${eventEndpointEnum.cancelled}.after.success`;
							const {title, message} = translateService.instant(key);
							return {
								title,
								message
							}
						}
					}
				}
			}
		},
		[eventEndpointEnum.done]: {
			path: eventEndpointEnum.done,
			method: RequestMethodEnum.PATCH,
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			},
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.PATCH.${eventEndpointEnum.done}.after.success`;
							const {title, message} = translateService.instant(key);
							return {
								title,
								message
							}
						}
					}
				}
			}
		},
	},
	DELETE: {
		[eventEndpointEnum.delete]: {
			path: eventEndpointEnum.delete,
			method: RequestMethodEnum.DELETE,
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
	},
}


Endpoint.registerEndpointCollection(eventEndpoint);
