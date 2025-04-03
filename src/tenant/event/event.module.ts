import {NgModule} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {
	DateRangeReportAnalyticState
} from "@tenant/analytic/presentation/store/date-range-report/date-range-report.analytic.state";
import {PeerCustomerOrderState} from "@tenant/order/infrastructure/state/peer-customer/peer-customer.order.state";
import {
	CalendarWithSpecialistsState
} from "@tenant/event/infrastructure/state/calendar-with-specialists/calendar–with-specialists.state";
import {SmsUsedAnalyticState} from "@tenant/analytic/presentation/store/sms-used/sms-used.analytic.state";
import {EventState} from "@tenant/event/infrastructure/state/event/event.state";
import {CalendarState} from "@tenant/event/infrastructure/state/calendar/calendar.state";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			PeerCustomerOrderState,

			// Calendar Module
			CalendarWithSpecialistsState,

			// Sms Module
			SmsUsedAnalyticState,

			// Calendar Module
			CalendarState,

			// Event module
			EventState,
			DateRangeReportAnalyticState,
		]),
	],
	providers: []
})
export class EventModule {

}
