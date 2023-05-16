import {ActiveEnum} from '@utility/domain/enum/active.enum';
import {LanguageCodeEnum} from '@utility/domain/enum';
import {CurrencyCodeEnum} from '@utility/domain/enum/currency-code.enum';
import {WeekDaysEnum} from '@utility/domain/enum/days-of-week.enum';

export interface IConfiguration {
  earliestDateTime?: string;
  latestDateTime?: string;
}

export interface IPrepaymentPolicy {
  isRequired?: string;
  isPercentage?: string;
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
  break: number;
  duration: number;
  prices: IPrice[];
}

export interface IService {
  active: ActiveEnum;
  configuration: IConfiguration;
  prepaymentPolicy: IPrepaymentPolicy;
  schedules: ISchedule[];
  languageVersions: ILanguageVersion[];
  durationVersions: IDurationVersion[];
  createdAt: string;
  updatedAt: string;
  _id: string;
}
