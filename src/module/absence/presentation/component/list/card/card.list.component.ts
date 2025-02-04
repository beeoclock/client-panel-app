import {Component, ViewEncapsulation} from "@angular/core";
import {AsyncPipe} from "@angular/common";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {AbsenceActions} from "@absence/state/absence/absence.actions";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {IAbsence} from "@absence/domain/interface/i.absence";
import {AbsenceProgressStatusEnum} from "@absence/presentation/pipe/absence-progress-status.pipe";
import {StateStatusComponent} from "@absence/presentation/component/state-status/state-status.component";

@Component({
	selector: 'app-absence-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TableStatePaginationComponent,
		DynamicDatePipe,
		TranslateModule,
		CardComponent,
		NoDataPipe,
		AsyncPipe,
		StateStatusComponent
	]
})
export class CardListComponent extends TableComponent<IAbsence.DTO> {

	public override open(item: IAbsence.DTO) {
		this.store.dispatch(new AbsenceActions.OpenDetails(item));
	}

	protected readonly absenceProgressStatusEnum = AbsenceProgressStatusEnum;
}
