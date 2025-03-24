import {NgModule} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {
	DateRangeReportAnalyticState
} from "@analytic/infrastructure/store/date-range-report/date-range-report.analytic.state";
import {PeerCustomerOrderState} from "@order/presentation/state/peer-customer/peer-customer.order.state";
import {
	CalendarWithSpecialistsState
} from "@event/presentation/state/calendar-with-specialists/calendar–with-specialists.state";
import {SmsUsedAnalyticState} from "@analytic/infrastructure/store/sms-used/sms-used.analytic.state";
import {EventState} from "@event/presentation/state/event/event.state";
import {CalendarState} from "@event/presentation/state/calendar/calendar.state";

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
