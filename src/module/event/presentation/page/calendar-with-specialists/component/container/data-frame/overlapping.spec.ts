import {Event, groupOverlappingEvents, isOverlapping} from './eventUtils'; // Припустимо, що ваші функції знаходяться в цьому файлі

describe('Event Utils', () => {
	describe('isOverlapping', () => {
		it('should return true when events overlap', () => {
			const event1: Event = {id: 1, start: new Date('2022-01-01T10:00:00'), end: new Date('2022-01-01T12:00:00')};
			const event2: Event = {id: 2, start: new Date('2022-01-01T11:00:00'), end: new Date('2022-01-01T13:00:00')};
			expect(isOverlapping(event1, event2)).toBe(true);
		});

		it('should return false when events do not overlap', () => {
			const event1: Event = {id: 1, start: new Date('2022-01-01T10:00:00'), end: new Date('2022-01-01T11:00:00')};
			const event2: Event = {id: 2, start: new Date('2022-01-01T12:00:00'), end: new Date('2022-01-01T13:00:00')};
			expect(isOverlapping(event1, event2)).toBe(false);
		});
	});

	describe('groupOverlappingEvents', () => {
		it('should group overlapping events together', () => {
			const events: Event[] = [
				{id: 1, start: new Date('2022-01-01T10:00:00'), end: new Date('2022-01-01T12:00:00')},
				{id: 2, start: new Date('2022-01-01T11:00:00'), end: new Date('2022-01-01T13:00:00')},
				{id: 3, start: new Date('2022-01-01T14:00:00'), end: new Date('2022-01-01T15:00:00')},
			];
			const groupedEvents = groupOverlappingEvents(events);
			expect(groupedEvents).toEqual([
				[events[0], events[1]],
				[events[2]],
			]);
		});

		it('should not group non-overlapping events together', () => {
			const events: Event[] = [
				{id: 1, start: new Date('2022-01-01T10:00:00'), end: new Date('2022-01-01T11:00:00')},
				{id: 2, start: new Date('2022-01-01T12:00:00'), end: new Date('2022-01-01T13:00:00')},
				{id: 3, start: new Date('2022-01-01T14:00:00'), end: new Date('2022-01-01T15:00:00')},
			];
			const groupedEvents = groupOverlappingEvents(events);
			expect(groupedEvents).toEqual([
				[events[0]],
				[events[1]],
				[events[2]],
			]);
		});
	});

	it('should group overlapping events together', () => {
		const events: Event[] = [
			// {id: 0.0, start: new Date('2022-01-01T09:00:00'), end: new Date('2022-01-01T17:00:00')},

			{id: 1.0, start: new Date('2022-01-01T10:00:00'), end: new Date('2022-01-01T11:00:00')},
			{id: 1.1, start: new Date('2022-01-01T10:00:00'), end: new Date('2022-01-01T11:00:00')},
			{id: 1.2, start: new Date('2022-01-01T10:10:00'), end: new Date('2022-01-01T12:00:00')},
			{id: 1.3, start: new Date('2022-01-01T09:10:00'), end: new Date('2022-01-01T10:01:00')},

			{id: 2.0, start: new Date('2022-01-01T12:00:00'), end: new Date('2022-01-01T13:00:00')},
			{id: 2.1, start: new Date('2022-01-01T12:59:00'), end: new Date('2022-01-01T15:00:00')},
		];
		const groupedEvents = groupOverlappingEvents(events);
		expect(groupedEvents).toEqual([
			[events[0], events[1], events[2], events[3]],
			[events[4], events[5]],
		]);
	});
});
