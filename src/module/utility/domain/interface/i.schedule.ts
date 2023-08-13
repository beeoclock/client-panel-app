import {WeekDaysEnum} from "@utility/domain/enum";

export interface ISchedule {
  workDays?: WeekDaysEnum[];
  startTime?: string;
  endTime?: string;
}
