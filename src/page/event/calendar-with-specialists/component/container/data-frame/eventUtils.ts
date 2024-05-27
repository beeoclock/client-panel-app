import {IEvent_V2} from "@event/domain";

export function isOverlapping(event1: IEvent_V2, event2: IEvent_V2, options = {
	inside: true,
	cover: true,
	startInside: true,
	endInside: true,
}): boolean {
	return (
		options.inside && event1.start >= event2.start && event1.end <= event2.end
	) || (
		options.cover && event1.start <= event2.start && event1.end >= event2.end
	) || (
		options.startInside && event1.start >= event2.start && event1.start < event2.end
	) || (
		options.endInside && event1.end > event2.start && event1.end <= event2.end
	) || false;
}

export function groupOverlappingEvents<T>(events: IEvent_V2[]): T[] {
	const groups: IEvent_V2[][] = [];

	for (const event of events) {
		let foundGroup = false;

		for (const group of groups) {
			if (group.some(groupEvent => isOverlapping(groupEvent, event))) {
				group.push(event);
				foundGroup = true;
				break;
			}
		}

		if (!foundGroup) {
			groups.push([event]);
		}
	}

	return groups as T[];
}
