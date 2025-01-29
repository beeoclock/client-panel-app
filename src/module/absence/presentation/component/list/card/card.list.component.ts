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
import {RowActionButtonComponent} from "@absence/presentation/component/row-action-button/row-action-button.component";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";
import {
	AbsenceProgressStatusEnum,
	AbsenceProgressStatusPipe
} from "@absence/presentation/pipe/absence-progress-status.pipe";

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
        RowActionButtonComponent,
        AsyncPipe,
        AbsenceProgressStatusPipe
    ]
})
export class CardListComponent extends TableComponent<IAbsenceDto> {

	// public override readonly actions = AbsenceActions;

	// public showAction = new BooleanStreamState(true);

	// public showSelectedStatus = new BooleanStreamState(false);

	public override open(item: IAbsenceDto) {
		this.store.dispatch(new AbsenceActions.OpenDetails(item));
	}

	protected readonly absenceProgressStatusEnum = AbsenceProgressStatusEnum;
}
