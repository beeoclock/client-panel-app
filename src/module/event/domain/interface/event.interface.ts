import * as Utility from '@utility/domain';

export interface IEvent {
  title: string;
  service: string;
  description: string;
  start: string;
  end: string;
  attendees: {
    email: string;
  }[];
  languageCodes: Utility.Enum.LanguageCodeEnum[];
}
