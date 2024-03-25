import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";
import {TranslateService} from "@ngx-translate/core";

export enum eventEndpointEnum {
	paged = '/api/v1/event/paged',
	busySlots = '/api/v1/event/busy-slots',
	mergedPaged = '/api/v1/event/merged-paged',
	slots = '/api/v1/event/slots',
	item = '/api/v1/event/{id}',
	update = '/api/v1/event/{id}',
	delete = '/api/v1/event/{id}',
	archive = '/api/v1/event/{id}/archive',
	booked = '/api/v1/event/{id}/booked',
	requested = '/api/v1/event/{id}/requested',
	cancelled = '/api/v1/event/{id}/cancelled',
	rejected = '/api/v1/event/{id}/rejected',
	done = '/api/v1/event/{id}/done',
	create = '/api/v1/event',
}

export const eventEndpoint: EndpointCollectionType = {
	GET: {
		[eventEndpointEnum.item]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
		[eventEndpointEnum.busySlots]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		},
		[eventEndpointEnum.paged]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true
			}
		},
		[eventEndpointEnum.mergedPaged]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true
			}
		},
		[eventEndpointEnum.slots]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true
			}
		},
	},
	POST: {
		[eventEndpointEnum.create]: {
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
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			},
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.PUT.${eventEndpointEnum.update}.after.success`;
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
	PATCH: {
		[eventEndpointEnum.archive]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
		[eventEndpointEnum.booked]: {
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
		[eventEndpointEnum.rejected]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			},
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.PATCH.${eventEndpointEnum.rejected}.after.success`;
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
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
	},
}


Endpoint.registerEndpointCollection(eventEndpoint);
