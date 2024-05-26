import {Component, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {AbsenceActions} from "@absence/state/absence/absence.actions";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {RowActionButtonComponent} from "@absence/presentation/component/row-action-button/row-action-button.component";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";

@Component({
	selector: 'app-absence-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgForOf,
		RouterLink,
		ActiveStyleDirective,
		TableStatePaginationComponent,
		DynamicDatePipe,
		SortIndicatorComponent,
		TranslateModule,
		EventStatusStyleDirective,
		CurrencyPipe,
		HumanizeDurationPipe,
		CardComponent,
		NgIf,
		NoDataPipe,
		RowActionButtonComponent,
		AsyncPipe
	]
})
export class CardListComponent extends TableComponent<IAbsenceDto> {

	public override readonly actions = AbsenceActions;

	public showAction = new BooleanStreamState(true);

	public showSelectedStatus = new BooleanStreamState(false);

	public override open(id: string) {
		this.store.dispatch(new AbsenceActions.OpenDetailsById(id));
	}

}
