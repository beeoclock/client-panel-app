import {Component, ViewEncapsulation} from "@angular/core";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {MemberActions} from "@member/infrastructure/state/member/member.actions";
import {BodyTableFlexDirective} from "@utility/presentation/directives/talbe/flex/body.table.flex.directive";
import {ColumnTableFlexDirective} from "@utility/presentation/directives/talbe/flex/column.table.flex.directive";
import {RowTableFlexDirective} from "@utility/presentation/directives/talbe/flex/row.table.flex.directive";
import {TableTableFlexDirective} from "@utility/presentation/directives/talbe/flex/table.table.flex.directive";
import {RowActionButtonComponent} from "@member/presentation/component/row-action-button/row-action-button.component";
import {IMember} from "@core/business-logic/member/interface/i.member";
import EMember from "@core/business-logic/member/entity/e.member";

@Component({
	selector: 'member-table-list-component',
	templateUrl: './table.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TableStatePaginationComponent,
		DynamicDatePipe,
		SortIndicatorComponent,
		TranslateModule,
		BodyTableFlexDirective,
		ColumnTableFlexDirective,
		RowActionButtonComponent,
		RowTableFlexDirective,
		TableTableFlexDirective,
		RowActionButtonComponent,
	]
})
export class TableListComponent extends TableComponent<EMember> {

	// public override readonly actions = MemberActions;

	public readonly tableConfiguration = {
		columns: {
			lastName: {
				style: {
					minWidth: '300px',
					flexGrow: 1,
				},
			},
			email: {
				style: {
					minWidth: '300px',
				},
			},
			phone: {
				style: {
					minWidth: '120px',
				},
			},
			assignmentsService: {
				style: {
					minWidth: '100px',
				},
			},
			role: {
				style: {
					minWidth: '120px',
				},
			},
			active: {
				style: {
					minWidth: '120px',
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
	}

	public override open(item: IMember.EntityRaw) {
		this.store.dispatch(new MemberActions.OpenDetails(item));
	}

}
