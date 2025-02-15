import {ChangeDetectionStrategy, Component, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ListPage} from "@utility/list.page";
import {Observable, tap} from "rxjs";
import {ITableState} from "@utility/domain/table.state";
import {CustomerState} from "@customer/infrastructure/state/customer/customer.state";
import {ICustomer} from "@src/core/business-logic/customer";
import {
	MobileLayoutListComponent
} from "@customer/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@customer/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {CustomerTableService} from "@customer/presentation/component/list/customer.table.service";
import {TableService} from "@utility/table.service";

@Component({
	selector: 'customer-external-list-component',
	templateUrl: './list.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		AsyncPipe,
		TranslateModule,
		MobileLayoutListComponent,
		DesktopLayoutListComponent,
	],
	standalone: true,
	providers: [
		{
			provide: TableService,
			useClass: CustomerTableService
		}
	]
})
export class CustomerExternalListComponent extends ListPage<ICustomer.Entity> {

	@ViewChildren(MobileLayoutListComponent)
	public mobileLayoutListComponents!: QueryList<MobileLayoutListComponent>;

	public readonly tableState$: Observable<ITableState<ICustomer.Entity>> = this.store.select(CustomerState.tableState)
		.pipe(
			tap((tableState) => {
				this.changeDetectorRef.detectChanges();
			})
		);

}
