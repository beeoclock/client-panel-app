import {Injectable} from "@angular/core";
import {DurationVersionTypeEnum} from "@core/business-logic/service/enum/duration-version-type.enum";
import {IService} from "@core/business-logic/service/interface/i.service";

@Injectable({
	providedIn: 'root'
})
export class DurationHelper {

	public durationIsRangeMode(item: IService.DTO): boolean {
		return item.configuration?.duration?.durationVersionType === DurationVersionTypeEnum.RANGE;
	}

}
