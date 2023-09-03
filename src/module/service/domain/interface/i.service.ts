import {ActiveEnum} from '@utility/domain/enum/active.enum';
import {ListMember} from "@member/domain";
import {RIBaseEntity} from '@utility/domain';
import {ISchedule} from "@utility/domain/interface/i.schedule";
import {
  IConfiguration,
  IPrepaymentPolicy,
  IPresentation,
  ListDurationVersion,
  ListLanguageVersion
} from "@service/domain";


export interface IService extends RIBaseEntity {
  object: 'Service';
  active: ActiveEnum;
  configuration: IConfiguration;
  prepaymentPolicy: IPrepaymentPolicy;
  schedules: ISchedule[];
  languageVersions: ListLanguageVersion;
  durationVersions: ListDurationVersion;
  permanentMembers: ListMember;
  presentation: IPresentation;
}
