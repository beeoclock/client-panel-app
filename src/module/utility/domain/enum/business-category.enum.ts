export enum BusinessCategoryEnum {
  BeautySalon = 'BeautySalon',
  Barbershop = 'Barbershop',
  Hairdresser = 'Hairdresser',
	PhysicalRehabilitation = 'PhysicalRehabilitation',
	Psychotherapy = 'Psychotherapy',
	Dentistry = 'Dentistry',
	Other = 'Other',

}


export const BusinessCategoryIconEnum = {
	[BusinessCategoryEnum.BeautySalon]: 'bi bi-person-hearts',
	[BusinessCategoryEnum.Barbershop]: 'bi bi-scissors',
	[BusinessCategoryEnum.Hairdresser]: 'bi bi-scissors',
	[BusinessCategoryEnum.Other]: 'bi bi-lightbulb',
	[BusinessCategoryEnum.PhysicalRehabilitation]: 'bi bi-person-wheelchair',
	[BusinessCategoryEnum.Psychotherapy]: 'bi bi-person-arms-up',
	[BusinessCategoryEnum.Dentistry]: 'bee-icon bee-icon-tooth',

}
