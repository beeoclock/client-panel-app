import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {CustomerState} from "@customer/state/customer/customer.state";
import {Observable, tap} from "rxjs";
import {ICustomer} from "@customer/domain";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {ITableState} from "@utility/domain/table.state";
import {TableListComponent} from "@customer/presentation/component/list/table/table.list.component";
import {StarterComponent} from "@utility/presentation/component/starter/starter.component";
import {TranslateModule} from "@ngx-translate/core";
import {FilterComponent} from "@customer/presentation/component/filter/filter.component";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {RouterLink} from "@angular/router";
import {AsyncPipe, NgIf} from "@angular/common";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";

@Component({
	selector: 'customer-list-page',
	templateUrl: './index.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        TableListComponent,
        StarterComponent,
        TranslateModule,
        FilterComponent,
        DropdownComponent,
        RouterLink,
        NgIf,
        AsyncPipe,
        PrimaryButtonDirective,
        NotFoundTableDataComponent
    ],
	standalone: true
})
export default class Index extends ListPage {

	public override readonly actions = CustomerActions;
	public readonly tableState$: Observable<ITableState<ICustomer>> = this.store.select(CustomerState.tableState)
		.pipe(
			tap((tableState) => {
				if (this.someDataExist.isOff) {
					this.someDataExist.toggle(tableState.total > 0);
					this.changeDetectorRef.detectChanges();
				}
			})
		);

}
