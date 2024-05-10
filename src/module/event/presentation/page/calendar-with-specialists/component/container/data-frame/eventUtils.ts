import {RIEvent} from "@event/domain";

export function isOverlapping(event1: RIEvent, event2: RIEvent, options = {
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

export function groupOverlappingEvents<T>(events: RIEvent[]): T[] {
	const groups: RIEvent[][] = [];

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
