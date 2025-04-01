export enum BusinessIndustryEnum {

	TeachingAndConsultation = 'TeachingAndConsultation',
	BeautyIndustry = 'BeautyIndustry',
	Healthcare = 'Healthcare',
	Other = 'Other',

}


export const BusinessIndustryIconEnum = {
	[BusinessIndustryEnum.Other]: 'bi bi-lightbulb',
	[BusinessIndustryEnum.TeachingAndConsultation]: 'bi bi-mortarboard-fill',
	[BusinessIndustryEnum.Healthcare]: 'bi bi-heart-pulse-fill',
	[BusinessIndustryEnum.BeautyIndustry]: 'bi bi-person-hearts',
}
