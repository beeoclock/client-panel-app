import {Injectable} from "@angular/core";
import {DurationVersionTypeEnum} from "@service/domain/enum/duration-version-type.enum";
import {IServiceDto} from "@order/external/interface/i.service.dto";

@Injectable({
	providedIn: 'root'
})
export class DurationHelper {

	public durationIsRangeMode(item: IServiceDto): boolean {
		return item.configuration?.duration?.durationVersionType === DurationVersionTypeEnum.RANGE;
	}

}
