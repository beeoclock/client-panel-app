import {DateTime} from "luxon";
import {IEvent} from "@tenant/event/domain";

export interface IDayItem {
	isPast: boolean;
	isToday: boolean;
	isTomorrow: boolean;
	datetime: DateTime;
	slots: { start: DateTime; end: DateTime }[];
	events: IEvent[];
}
