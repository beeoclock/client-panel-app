import {Injectable} from "@angular/core";
import {DurationVersionTypeEnum} from "../../../../core/business-logic/service/enum/duration-version-type.enum";
import {IServiceDto} from "../../../../core/business-logic/order/interface/i.service.dto";

@Injectable({
	providedIn: 'root'
})
export class DurationHelper {

	public durationIsRangeMode(item: IServiceDto): boolean {
		return item.configuration?.duration?.durationVersionType === DurationVersionTypeEnum.RANGE;
	}

}
