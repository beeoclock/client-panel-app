import {Component, ViewEncapsulation} from "@angular/core";
import {NgIf} from "@angular/common";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {AbsenceActions} from "@absence/state/absence/absence.actions";
import {BodyTableFlexDirective} from "@utility/presentation/directives/talbe/flex/body.table.flex.directive";
import {ColumnTableFlexDirective} from "@utility/presentation/directives/talbe/flex/column.table.flex.directive";
import {RowTableFlexDirective} from "@utility/presentation/directives/talbe/flex/row.table.flex.directive";
import {TableTableFlexDirective} from "@utility/presentation/directives/talbe/flex/table.table.flex.directive";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {RowActionButtonComponent} from "@absence/presentation/component/row-action-button/row-action-button.component";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";

@Component({
	selector: 'app-list-absence-table',
	templateUrl: './table.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ActiveStyleDirective,
		TableStatePaginationComponent,
		DynamicDatePipe,
		SortIndicatorComponent,
		TranslateModule,
		BodyTableFlexDirective,
		ColumnTableFlexDirective,
		RowTableFlexDirective,
		TableTableFlexDirective,
		NoDataPipe,
		RowActionButtonComponent,
		NgIf
	]
})
export class TableListComponent extends TableComponent<IAbsenceDto> {

	public readonly tableConfiguration = {
		columns: {
			type: {
				style: {
					minWidth: '100px',
					flexGrow: 1,
				},
			},
			start: {
				style: {
					minWidth: '200px',
				},
			},
			end: {
				style: {
					minWidth: '200px',
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
					minWidth: '200px',
				},
			},
			updatedAt: {
				style: {
					minWidth: '200px',
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
	public override open(item: IAbsenceDto) {
		return new AbsenceActions.OpenDetails(item);
	}

}
