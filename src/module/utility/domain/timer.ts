import {delay, interval, of, Subject, takeUntil, tap} from "rxjs";

/**
 *
 * @param timer
 */
export const buildTimeOut$ = (timer: number) => {
	return of(true).pipe(delay(timer));
};

/**
 *
 * @param cb
 * @param timer
 */
export const setTimeout$ = (cb: () => void, timer: number) => {
	return buildTimeOut$(timer).pipe(tap(cb));
};

export type setTimeoutTakeUntil$Type = ReturnType<typeof setTimeoutTakeUntil$>;

/**
 *
 * @param cb
 * @param timer
 */
export const setTimeoutTakeUntil$ = (cb: () => void, timer: number) => {
	const destroyTimeout$ = new Subject<void>();
	const timeout$ = buildTimeOut$(timer).pipe(takeUntil(destroyTimeout$)).subscribe(cb);
	return {destroyTimeout$, timeout$};
};

export const setIntervals$ = (cb: () => void, timer: number) => {
	return interval(timer).pipe(tap(cb));
};
