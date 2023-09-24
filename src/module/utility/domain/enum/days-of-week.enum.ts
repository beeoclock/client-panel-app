// ISO: https://en.wikipedia.org/wiki/ISO_week_date
export enum DaysNameOfWeekEnum {
	monday = 'monday',
	tuesday = 'tuesday',
	wednesday = 'wednesday',
	thursday = 'thursday',
	friday = 'friday',
	saturday = 'saturday',
	sunday = 'sunday',
}

export enum WeekDaysEnum {
	MONDAY = 1,
	TUESDAY = 2,
	WEDNESDAY = 3,
	THURSDAY = 4,
	FRIDAY = 5,
	SATURDAY= 6,
	SUNDAY = 7,
}

export const WORK_WEEK = [
	WeekDaysEnum.MONDAY,
	WeekDaysEnum.TUESDAY,
	WeekDaysEnum.WEDNESDAY,
	WeekDaysEnum.THURSDAY,
	WeekDaysEnum.FRIDAY
];

export const WEEK = [
	WeekDaysEnum.MONDAY,
	WeekDaysEnum.TUESDAY,
	WeekDaysEnum.WEDNESDAY,
	WeekDaysEnum.THURSDAY,
	WeekDaysEnum.FRIDAY,
	WeekDaysEnum.SATURDAY,
	WeekDaysEnum.SUNDAY,
];

export const WEEK_DAYS_NAME = [
	DaysNameOfWeekEnum.monday,
	DaysNameOfWeekEnum.tuesday,
	DaysNameOfWeekEnum.wednesday,
	DaysNameOfWeekEnum.thursday,
	DaysNameOfWeekEnum.friday,
	DaysNameOfWeekEnum.saturday,
	DaysNameOfWeekEnum.sunday,
];
