import {createPropertySelectors, Selector} from "@ngxs/store";
import {
	CalendarWithSpecialistsState,
	ICalendarWithSpecialist
} from "@tenant/event/infrastructure/state/calendar-with-specialists/calendar–with-specialists.state";
import {DateTime} from "luxon";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {IOrderService} from "@tenant/order/order-service/domain/interface/i.order-service.dto";
import {IAbsence} from "@tenant/member/absence/domain/interface/i.absence";
import {IEvent_V2} from "@tenant/event/domain";


export class CalendarWithSpecialistsQueries {
	static state = createPropertySelectors<ICalendarWithSpecialist>(CalendarWithSpecialistsState);

	@Selector([CalendarWithSpecialistsQueries.state.params])
	static start({start}: ICalendarWithSpecialist['params']) {
		return DateTime.fromISO(start);
	}

	@Selector([CalendarWithSpecialistsQueries.state.params])
	static isToday({start}: ICalendarWithSpecialist['params']) {
		return DateTime.fromISO(start).hasSame(DateTime.now(), 'day');
	}

	@Selector([CalendarWithSpecialistsQueries.state.params])
	static isTomorrow({start}: ICalendarWithSpecialist['params']) {
		return DateTime.fromISO(start).hasSame(DateTime.now().plus({days: 1}), 'day');
	}

	@Selector([CalendarWithSpecialistsQueries.state.params])
	static params(params: ICalendarWithSpecialist['params']) {
		return params;
	}

	@Selector([CalendarWithSpecialistsQueries.state.loader])
	static loader(loader: ICalendarWithSpecialist['loader']) {
		return loader;
	}

	@Selector([CalendarWithSpecialistsQueries.state.data])
	static data(data: ICalendarWithSpecialist['data']) {
		return data as IEvent_V2<{ order: IOrder.DTO; service: IOrderService.DTO; } | IAbsence.DTO>[];
	}

}
