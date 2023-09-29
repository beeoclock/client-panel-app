import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {TableComponent} from '@utility/presentation/component/table/table.component';
import {HeaderTableComponent} from '@utility/presentation/component/table/header.table.component';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {ListPage} from "@utility/list.page";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {TranslateModule} from "@ngx-translate/core";
import {Observable, tap} from "rxjs";
import {IMember} from "@member/domain";
import {MemberActions} from "@member/state/member/member.actions";
import {MemberState} from "@member/state/member/member.state";
import {ITableState} from "@utility/domain/table.state";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {FilterComponent} from "@member/presentation/component/filter/filter.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TableListComponent} from "@member/presentation/component/list/table/table.list.component";
import {StarterComponent} from "@utility/presentation/component/starter/starter.component";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";

@Component({
	selector: 'member-list-page',
	templateUrl: './index.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		RouterLink,
		DeleteButtonComponent,
		TableComponent,
		HeaderTableComponent,
		NgForOf,
		DatePipe,
		FilterComponent,
		DropdownComponent,
		NgIf,
		SortIndicatorComponent,
		LoaderComponent,
		ActionComponent,
		TranslateModule,
		AsyncPipe,
		TableStatePaginationComponent,
		FilterComponent,
		DynamicDatePipe,
		TableListComponent,
		StarterComponent,
		NotFoundTableDataComponent
	],
	standalone: true
})
export default class Index extends ListPage {

	public override readonly actions = MemberActions;

	public readonly tableState$: Observable<ITableState<IMember>> = this.store.select(MemberState.tableState)
		.pipe(
			tap((tableState) => {
				if (this.someDataExist.isOff) {
					this.someDataExist.toggle(tableState.total > 0);
					this.changeDetectorRef.detectChanges();
				}
			})
		);

}
