import {ActiveEnum} from '@utility/domain/enum/active.enum';
import {LanguageCodeEnum} from '@utility/domain/enum';
import {CurrencyCodeEnum} from '@utility/domain/enum/currency-code.enum';
import {WeekDaysEnum} from '@utility/domain/enum/days-of-week.enum';
import {IEmployee} from "@employee/domain";

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
  permanentEmployees: IEmployee[];
  createdAt: string;
  updatedAt: string;
  _id: string;
}
