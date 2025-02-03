import {DurationVersionTypeEnum} from "@service/domain/enum/duration-version-type.enum";

export interface IDurationConfiguration {
	object: 'DurationConfiguration';
	durationVersionType: DurationVersionTypeEnum;
}
