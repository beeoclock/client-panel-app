import {Component, ViewEncapsulation} from "@angular/core";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {AbsenceActions} from "@absence/infrastructure/state/absence/absence.actions";
import {BodyTableFlexDirective} from "@utility/presentation/directives/talbe/flex/body.table.flex.directive";
import {ColumnTableFlexDirective} from "@utility/presentation/directives/talbe/flex/column.table.flex.directive";
import {RowTableFlexDirective} from "@utility/presentation/directives/talbe/flex/row.table.flex.directive";
import {TableTableFlexDirective} from "@utility/presentation/directives/talbe/flex/table.table.flex.directive";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {RowActionButtonComponent} from "@absence/presentation/component/row-action-button/row-action-button.component";
import {IAbsence} from "@src/core/business-logic/absence/interface/i.absence";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {AbsenceProgressStatusEnum} from "@absence/presentation/pipe/absence-progress-status.pipe";
import {StateStatusComponent} from "@absence/presentation/component/state-status/state-status.component";
import EAbsence from "@core/business-logic/absence/entity/e.absence";
import {DatePipe} from "@angular/common";

@Component({
	selector: 'app-list-absence-table',
	templateUrl: './table.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TableStatePaginationComponent,
		SortIndicatorComponent,
		TranslateModule,
		BodyTableFlexDirective,
		ColumnTableFlexDirective,
		RowTableFlexDirective,
		TableTableFlexDirective,
		NoDataPipe,
		RowActionButtonComponent,
		StateStatusComponent,
		DatePipe,
	]
})
export class TableListComponent extends TableComponent<EAbsence> {

	public readonly absenceProgressStatusEnum = AbsenceProgressStatusEnum

	public readonly tableConfiguration = {
		columns: {
			type: {
				style: {
					minWidth: '100px',
					flexGrow: 1,
				},
			},
			progressStatus: {
				style: {
					minWidth: '140px',
				},
			},
			start: {
				style: {
					minWidth: '180px',
				},
			},
			end: {
				style: {
					minWidth: '180px',
				},
			},
			attendees: {
				style: {
					minWidth: '150px',
				},
			},
			note: {
				style: {
					minWidth: '200px',
				},
			},
			createdAt: {
				style: {
					minWidth: '180px',
				},
			},
			updatedAt: {
				style: {
					minWidth: '180px',
				},
			},
			action: {
				classList: ['bg-white', 'justify-center'],
				style: {
					minWidth: '75px',
				},
			},
		},
	};

	@Dispatch()
	public override open(item: IAbsence.DTO) {
		const entity = EAbsence.fromDTO(item);
		return new AbsenceActions.OpenDetails(entity);
	}

}
