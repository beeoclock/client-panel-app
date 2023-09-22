export enum DaysNameOfWeekEnum {
  sunday = 'sunday',
  monday = 'monday',
  tuesday = 'tuesday',
  wednesday = 'wednesday',
  thursday = 'thursday',
  friday = 'friday',
  saturday = 'saturday',
}

export enum WeekDaysEnum {
	SUNDAY = 0,
	MONDAY,
	TUESDAY,
	WEDNESDAY,
	THURSDAY,
	FRIDAY,
	SATURDAY,
}

export const WORK_WEEK = [
  WeekDaysEnum.MONDAY,
  WeekDaysEnum.TUESDAY,
  WeekDaysEnum.WEDNESDAY,
  WeekDaysEnum.THURSDAY,
  WeekDaysEnum.FRIDAY
];

export const WEEK_DAYS = [
  WeekDaysEnum.SUNDAY,
  WeekDaysEnum.MONDAY,
  WeekDaysEnum.TUESDAY,
  WeekDaysEnum.WEDNESDAY,
  WeekDaysEnum.THURSDAY,
  WeekDaysEnum.FRIDAY,
  WeekDaysEnum.SATURDAY
];

export const WEEK_DAYS_NAME = [
  DaysNameOfWeekEnum.sunday,
  DaysNameOfWeekEnum.monday,
  DaysNameOfWeekEnum.tuesday,
  DaysNameOfWeekEnum.wednesday,
  DaysNameOfWeekEnum.thursday,
  DaysNameOfWeekEnum.friday,
  DaysNameOfWeekEnum.saturday
];
