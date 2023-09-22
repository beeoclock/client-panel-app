export function extractSecondsFromTime(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60;
}

export const ONE_WEEK_IN_SECONDS = 604_800;
export const ONE_DAY_IN_SECONDS = 86_400;
export const TWO_HOUR_IN_SECONDS = 7_200;
export const ONE_HOUR_IN_SECONDS = 3_600;
export const ONE_MINUTE_IN_SECONDS = 60;
export const TWENTY_SECONDS = 20;
export const HALF_HOUR_IN_SECONDS = 1_800;
export const FIFTY_MINUTES_IN_SECONDS = 3_000;

export function extract_hh_mm_ss_properties(value: number, fromUTC = false) {

	let totalSeconds = value ?? 0;

	if (fromUTC) {
		const timeZoneOffsetInSeconds = new Date().getTimezoneOffset() * 60;
		totalSeconds -= timeZoneOffsetInSeconds; // 3600 - (-120) = 3720
	}

	const hours = Math.floor(totalSeconds / ONE_HOUR_IN_SECONDS);
	const minutes = Math.floor((totalSeconds % ONE_HOUR_IN_SECONDS) / ONE_MINUTE_IN_SECONDS);
	const seconds = totalSeconds % ONE_MINUTE_IN_SECONDS;

	const formattedHours = String(hours).padStart(2, '0');
	const formattedMinutes = String(minutes).padStart(2, '0');
	const formattedSeconds = String(seconds).padStart(2, '0');

	return {formattedHours, formattedMinutes, formattedSeconds};

}

export function secondsTo_hh_mm(value: number, fromUTC = false): string {

	const {formattedHours, formattedMinutes} = extract_hh_mm_ss_properties(value, fromUTC);

	return `${formattedHours}:${formattedMinutes}`;

}

export function secondsTo_hh_mm_ss(value: number, fromUTC = false): string {

	const {formattedHours, formattedMinutes, formattedSeconds} = extract_hh_mm_ss_properties(value, fromUTC);

	return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

}

export function secondsTo_dd_hh_mm_ss(value: number, fromUTC = false): string {

	let restValue = value;
	let days = 0;

	if (fromUTC) {
		const timeZoneOffsetInSeconds = new Date().getTimezoneOffset() * 60;
		restValue -= timeZoneOffsetInSeconds; // 3600 - (-120) = 3720
	}

	if (value >= ONE_DAY_IN_SECONDS) {

		days = Math.floor(value / ONE_DAY_IN_SECONDS);
		restValue = value % ONE_DAY_IN_SECONDS;

	}

	return `${String(days).padStart(2, '0')} ${secondsTo_hh_mm_ss(restValue)}`;

}

export function extractSecondsFrom_hh_mm_ss(formattedTime: string, toUTC = false): number {
	try {
		// TODO check if minutes and seconds are 00 if they have one digit then it is ten minutes or ten seconds (1:1:1 = 1 hour 10 minute 10 second)
		const [hours, minutes, seconds] = formattedTime.split(':').map(Number);
		let result = hours * ONE_HOUR_IN_SECONDS + (minutes ?? 0) * ONE_MINUTE_IN_SECONDS + (seconds ?? 0);
		if (toUTC) {
			const timeZoneOffsetInSeconds = new Date().getTimezoneOffset() * 60;
			result += timeZoneOffsetInSeconds; // 3600 + (-120) = 3480
		}
		return result;
	} catch (e) {
		return NaN;
	}
}

export function extractSecondsFrom_dd_hh_mm_ss(formattedTime: string): number {
	try {
		const [days, time] = formattedTime.split(' ');
		return Number(days) * ONE_DAY_IN_SECONDS + extractSecondsFrom_hh_mm_ss(time);
	} catch (e) {
		return NaN;
	}
}
