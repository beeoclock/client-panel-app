import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {TableComponent} from '@utility/presentation/component/table/table.component';
import {HeaderTableComponent} from '@utility/presentation/component/table/header.table.component';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {FilterComponent} from '@service/presentation/component/filter/filter.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {TranslateModule} from '@ngx-translate/core';
import {IService} from '@service/domain';
import {ListPage} from "@utility/list.page";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {Observable, tap} from "rxjs";
import {ServiceActions} from "@service/state/service/service.actions";
import {ServiceState} from "@service/state/service/service.state";
import {ITableState} from "@utility/domain/table.state";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TableListComponent} from "@service/presentation/component/list/table/table.list.component";
import {StarterComponent} from "@utility/presentation/component/starter/starter.component";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";

@Component({
	selector: 'service-list-page',
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
		AsyncPipe,
		NgIf,
		SpinnerComponent,
		DropdownComponent,
		SortIndicatorComponent,
		LoaderComponent,
		ActionComponent,
		TranslateModule,
		TableStatePaginationComponent,
		NgClass,
		ActiveStyleDirective,
		DynamicDatePipe,
		TableListComponent,
		StarterComponent,
		NotFoundTableDataComponent
	],
	standalone: true
})
export default class Index extends ListPage {

	public override readonly actions = ServiceActions;

	public readonly tableState$: Observable<ITableState<IService>> = this.store.select(ServiceState.tableState)
		.pipe(
			tap((tableState) => {
				if (this.someDataExist.isOff) {
					this.someDataExist.toggle(tableState.total > 0);
					this.changeDetectorRef.detectChanges();
				}
			})
		);

}
