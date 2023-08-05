import {ActiveEnum} from '@utility/domain/enum/active.enum';
import {LanguageCodeEnum} from '@utility/domain/enum';
import {CurrencyCodeEnum} from '@utility/domain/enum/currency-code.enum';
import {WeekDaysEnum} from '@utility/domain/enum/days-of-week.enum';
import {IMember} from "@member/domain";
import {Interface} from '@utility/domain';

export interface IConfiguration {
  earliestDateTime?: string;
  latestDateTime?: string;
}

export interface IPrepaymentPolicy {
  isRequired?: boolean;
  isPercentage?: boolean;
  value?: string;
  minimalCancelTime?: string;
}

export interface ISchedule {
  workDays?: WeekDaysEnum[];
  startTime?: string;
  endTime?: string;
}

export interface ILanguageVersion {
  title?: string;
  description?: string;
  language?: LanguageCodeEnum;
  active?: ActiveEnum;
}

export interface IPrice {
  price?: number;
  currency?: CurrencyCodeEnum;
  preferredLanguages?: LanguageCodeEnum[];
}

export interface IDurationVersion {
  break: string;
  duration: string;
  prices: IPrice[];
}

export interface IPresentation extends Interface.IBaseEntity {
  main: string;
  object: 'Service.Presentation';
}

export interface IService extends Interface.IBaseEntity {
  object: 'Service';
  active: ActiveEnum;
  configuration: IConfiguration;
  prepaymentPolicy: IPrepaymentPolicy;
  schedules: ISchedule[];
  languageVersions: ILanguageVersion[];
  durationVersions: IDurationVersion[];
  permanentMembers: IMember[];
  presentation: IPresentation;
}
