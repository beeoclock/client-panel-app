import {Injectable} from "@angular/core";
import {IService} from "@service/domain";
import {DurationVersionTypeEnum} from "@service/domain/enum/duration-version-type.enum";

@Injectable({
	providedIn: 'root'
})
export class DurationHelper {

	public durationIsRangeMode(item: IService): boolean {
		return item.configuration?.duration?.durationVersionType === DurationVersionTypeEnum.RANGE;
	}

}
