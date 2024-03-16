import {Component, ViewEncapsulation} from "@angular/core";
import {NgForOf} from "@angular/common";
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
import {RIMember} from "@member/domain";
import {MemberActions} from "@member/state/member/member.actions";
import {BodyTableFlexDirective} from "@utility/presentation/directives/talbe/flex/body.table.flex.directive";
import {ColumnTableFlexDirective} from "@utility/presentation/directives/talbe/flex/column.table.flex.directive";
import {RowTableFlexDirective} from "@utility/presentation/directives/talbe/flex/row.table.flex.directive";
import {TableTableFlexDirective} from "@utility/presentation/directives/talbe/flex/table.table.flex.directive";
import {RowActionButtonComponent} from "@member/presentation/component/row-action-button/row-action-button.component";

@Component({
	selector: 'member-table-list-component',
	templateUrl: './table.list.component.html',
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
		BodyTableFlexDirective,
		ColumnTableFlexDirective,
		RowActionButtonComponent,
		RowTableFlexDirective,
		TableTableFlexDirective,
		RowActionButtonComponent
	]
})
export class TableListComponent extends TableComponent<RIMember> {

	public override readonly actions = MemberActions;

	public readonly tableConfiguration = {
		columns: {
			lastName: {
				style: {
					minWidth: '400px',
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
			role: {
				style: {
					minWidth: '300px',
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

}
