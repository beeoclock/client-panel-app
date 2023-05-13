import * as Utility from '@utility/domain';
import {IService} from "@service/domain";

export interface IEvent {
  _id: string;
  title: string;
  services: IService[];
  description: string;
  start: string;
  end: string;
  createdAt: string;
  updatedAt: string;
  attendees: {
    email: string;
  }[];
  languageCodes: Utility.Enum.LanguageCodeEnum[];
}
