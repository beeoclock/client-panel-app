import {createPropertySelectors, Selector} from "@ngxs/store";
import {DateTime} from "luxon";
import {IStatisticState, StatisticState} from "@event/state/statistic/statistic.state";

export class StatisticQueries {
	static state = createPropertySelectors<IStatisticState>(StatisticState);

	@Selector([StatisticQueries.state.params])
	static start({start}: IStatisticState['params']) {
		return DateTime.fromISO(start);
	}

	@Selector([StatisticQueries.state.params])
	static isToday({start}: IStatisticState['params']) {
		return DateTime.fromISO(start).hasSame(DateTime.now(), 'day');
	}

	@Selector([StatisticQueries.state.params])
	static isTomorrow({start}: IStatisticState['params']) {
		return DateTime.fromISO(start).hasSame(DateTime.now().plus({days: 1}), 'day');
	}

	@Selector([StatisticQueries.state.params])
	static params(params: IStatisticState['params']) {
		return params;
	}

	@Selector([StatisticQueries.state.loader])
	static loader(loader: IStatisticState['loader']) {
		return loader;
	}

	@Selector([StatisticQueries.state.data])
	static data(data: IStatisticState['data']) {
		return data;
	}

}
