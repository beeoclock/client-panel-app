import {ServiceProvideTypeEnum, ServiceProvideTypeIconEnum} from "@core/shared/enum/service-provide-type.enum";

export class ServiceProvideType {

	static readonly list = Object.keys(ServiceProvideTypeEnum) as (keyof typeof ServiceProvideTypeEnum)[];
	static readonly listWithIcon = ServiceProvideType.list.map((type) => {
		return {
			icon: ServiceProvideTypeIconEnum[type],
			label: type,
		}
	});

}
