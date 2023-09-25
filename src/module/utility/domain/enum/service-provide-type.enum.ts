export enum ServiceProvideTypeEnum {

	Online = 'Online',
	Offline = 'Offline',
	Mixed = 'Mixed',

}

export const ServiceProvideTypeIconEnum = {
	[ServiceProvideTypeEnum.Online]: 'bi bi-globe-americas',
	[ServiceProvideTypeEnum.Offline]: 'bi bi-person-raised-hand',
	[ServiceProvideTypeEnum.Mixed]: 'bi bi-person-video2',
}
