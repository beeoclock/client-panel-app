import {Component, ViewEncapsulation} from "@angular/core";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";
import {EventActions} from "@event/state/event/event.actions";
import {RMIEvent} from "@event/domain";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {ButtonsDetailsComponent} from "@event/presentation/component/details/buttons.details.component";
import {
	ChangeStatusOnBookedComponent
} from "@event/presentation/component/change-status/change-status-on-booked.component";
import {
	ChangeStatusOnCancelledComponent
} from "@event/presentation/component/change-status/change-status-on-cancelled.component";
import {ChangeStatusOnDoneComponent} from "@event/presentation/component/change-status/change-status-on-done.component";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";

@Component({
	selector: 'event-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgForOf,
		RouterLink,
		ActiveStyleDirective,
		ActionComponent,
		TableStatePaginationComponent,
		DynamicDatePipe,
		SortIndicatorComponent,
		TranslateModule,
		EventStatusStyleDirective,
		CurrencyPipe,
		HumanizeDurationPipe,
		CardComponent,
		NgIf,
		DatePipe,
		ButtonsDetailsComponent,
		ChangeStatusOnBookedComponent,
		ChangeStatusOnCancelledComponent,
		ChangeStatusOnDoneComponent,
		NoDataPipe
	]
})
export class CardListComponent extends TableComponent<RMIEvent> {

	public override readonly actions = EventActions;

	public sameYear(start: string | undefined): boolean {
		return start ? new Date(start).getFullYear() === new Date().getFullYear() : false;
	}
}
