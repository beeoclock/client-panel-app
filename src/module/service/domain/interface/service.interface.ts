import {ActiveEnum} from '@utility/domain/enum/active.enum';
import {LanguageCodeEnum} from '@utility/domain/enum';
import {CurrencyCodeEnum} from '@utility/domain/enum/currency-code.enum';
import {DaysOfWeekEnum} from '@utility/domain/enum/days-of-week.enum';

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
  daysOfTheWeek?: DaysOfWeekEnum[];
  startTime?: string;
  endTime?: string;
}

export interface ILanguageVersion {
  service?: string;
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
  break?: number;
  service?: string;
  active?: ActiveEnum;
  duration?: number;
  prices?: IPrice[];
}

export interface IService {
  active?: ActiveEnum;
  configuration?: IConfiguration;
  prepaymentPolicy?: IPrepaymentPolicy;
  schedules?: ISchedule[];
  languageVersions?: ILanguageVersion[];
  durationVersions?: IDurationVersion[];
  createdAt?: string;
  updatedAt?: string;
}
