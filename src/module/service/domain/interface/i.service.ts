import {ActiveEnum} from '@utility/domain/enum/active.enum';
import {RIBaseEntity} from '@utility/domain';
import {ISchedule} from "@utility/domain/interface/i.schedule";
import {
	IConfiguration,
	IPrepaymentPolicy,
	IPresentation,
	ListDurationVersion,
	ListLanguageVersion
} from "@service/domain";
import {ISpecialist} from "@service/domain/interface/i.specialist";


export interface IService extends RIBaseEntity<'Service'> {
	active: ActiveEnum;
	configuration: IConfiguration;
	prepaymentPolicy?: IPrepaymentPolicy;
	schedules: ISchedule[];
	languageVersions: ListLanguageVersion;
	durationVersions: ListDurationVersion;
	specialists: ISpecialist[];
	presentation?: IPresentation;
	order?: number | null;
}
