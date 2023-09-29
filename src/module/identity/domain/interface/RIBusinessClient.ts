import {BusinessCategoryEnum} from "@utility/domain/enum/business-category.enum";
import {ServiceProvideTypeEnum} from "@utility/domain/enum/service-provide-type.enum";
import {BusinessIndustryEnum} from "@utility/domain/enum/business-industry.enum";

export interface RIBusinessClient {

	name: string;
	serviceProvideType: ServiceProvideTypeEnum;
	businessCategory: BusinessCategoryEnum;
	businessIndustry: BusinessIndustryEnum;

}

export type IBusinessClient = Partial<RIBusinessClient>;
