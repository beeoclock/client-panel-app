import {BusinessCategoryEnum, BusinessCategoryIconEnum} from "@utility/domain/enum/business-category.enum";

export class BusinessCategory {

	static readonly list = Object.keys(BusinessCategoryEnum) as (keyof typeof BusinessCategoryEnum)[];
	static readonly listWithIcon = BusinessCategory.list.map((category) => {
		return {
			icon: BusinessCategoryIconEnum[category],
			label: category,
		}
	});

}
