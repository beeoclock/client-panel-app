import {IService} from "@service/domain";

export interface IEvent {
  _id: string;
  services: IService[];
  description: string;
  start: string;
  end: string;
  createdAt: string;
  updatedAt: string;
  attendees: {
    email: string;
  }[];
}
