import {Injectable} from "@angular/core";
import {DateTime} from "luxon";

@Injectable()
export class DateSliderSelectService {

	/**
	 * Helper function to generate a list of day items
	 * @param sourceDatetime
	 * @param amountOfDaySlotsInContainer
	 */
	public generateDayItemList(sourceDatetime: DateTime, amountOfDaySlotsInContainer: number) {

		const dayItemList = [];

		for (let day = 0; day < amountOfDaySlotsInContainer; day++) {

			const datetime = sourceDatetime.plus({day}).startOf('day');

			dayItemList.push({
				isPast: datetime.startOf('day') < DateTime.now().startOf('day'),
				isToday: datetime.hasSame(DateTime.now(), 'day'),
				isTomorrow: datetime.hasSame(DateTime.now().plus({day: 1}), 'day'),
				datetime,
				slots: [],
				events: [],
			});

		}

		return dayItemList;

	}

}
