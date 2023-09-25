import {BusinessIndustryEnum, BusinessIndustryIconEnum} from "@utility/domain/enum/business-industry.enum";

export class BusinessIndustry {

	static readonly list = Object.keys(BusinessIndustryEnum) as (keyof typeof BusinessIndustryEnum)[];
	static readonly listWithIcon = BusinessIndustry.list.map((industry) => {
		return {
			icon: BusinessIndustryIconEnum[industry],
			label: industry,
		}
	});

}
