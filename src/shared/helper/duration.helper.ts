import {Injectable} from "@angular/core";
import {DurationVersionTypeEnum} from "@tenant/service/domain/enum/duration-version-type.enum";
import {IService} from "@tenant/service/domain/interface/i.service";

@Injectable({
	providedIn: 'root'
})
export class DurationHelper {

	public durationIsRangeMode(item: IService.DTO): boolean {
		return item.configuration?.duration?.durationVersionType === DurationVersionTypeEnum.RANGE;
	}

}
