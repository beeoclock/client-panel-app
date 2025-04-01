import {BusinessCategoryEnum, BusinessCategoryIconEnum} from "@core/shared/enum/business-category.enum";
import {BusinessIndustryEnum} from "@core/shared/enum/business-industry.enum";

export class BusinessCategory {

	static readonly listsByIndustry: {[key in keyof typeof BusinessIndustryEnum]?: {
		icon: string,
		label: BusinessCategoryEnum
	}[]} = {
		[BusinessIndustryEnum.BeautyIndustry]: [
			{
				icon: BusinessCategoryIconEnum[BusinessCategoryEnum.EyebrowStylist],
				label: BusinessCategoryEnum.EyebrowStylist,
			},
			{
				icon: BusinessCategoryIconEnum[BusinessCategoryEnum.Manicurist],
				label: BusinessCategoryEnum.Manicurist,
			},
			{
				icon: BusinessCategoryIconEnum[BusinessCategoryEnum.Hairdresser],
				label: BusinessCategoryEnum.Hairdresser,
			},
			{
				icon: BusinessCategoryIconEnum[BusinessCategoryEnum.Barbershop],
				label: BusinessCategoryEnum.Barbershop,
			},
			{
				icon: BusinessCategoryIconEnum[BusinessCategoryEnum.BeautySalon],
				label: BusinessCategoryEnum.BeautySalon,
			},
			{
				icon: BusinessCategoryIconEnum[BusinessCategoryEnum.Other],
				label: BusinessCategoryEnum.Other,
			},
		],
		[BusinessIndustryEnum.Healthcare]: [
			// {
			// 	icon: BusinessCategoryIconEnum[BusinessCategoryEnum.Dentistry],
			// 	label: BusinessCategoryEnum.Dentistry,
			// },
			{
				icon: BusinessCategoryIconEnum[BusinessCategoryEnum.PhysicalRehabilitation],
				label: BusinessCategoryEnum.PhysicalRehabilitation,
			},
			{
				icon: BusinessCategoryIconEnum[BusinessCategoryEnum.Psychotherapy],
				label: BusinessCategoryEnum.Psychotherapy,
			},
			{
				icon: BusinessCategoryIconEnum[BusinessCategoryEnum.Other],
				label: BusinessCategoryEnum.Other,
			},
		]
	};

}
