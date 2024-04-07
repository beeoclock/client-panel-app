import {ChangeDetectionStrategy, Component, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ListPage} from "@utility/list.page";
import {Observable, tap} from "rxjs";
import {ITableState} from "@utility/domain/table.state";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {CustomerState} from "@customer/state/customer/customer.state";
import {ICustomer} from "@customer/domain";
import {
	MobileLayoutListComponent
} from "@customer/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@customer/presentation/component/list/layout/desktop/desktop.layout.list.component";

@Component({
	selector: 'customer-external-list-component',
	templateUrl: './list.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		AsyncPipe,
		NgIf,
		TranslateModule,
		MobileLayoutListComponent,
		DesktopLayoutListComponent,
	],
	standalone: true
})
export class CustomerExternalListComponent extends ListPage {

	@ViewChildren(MobileLayoutListComponent)
	public mobileLayoutListComponents!: QueryList<MobileLayoutListComponent>;

	public override readonly actions = CustomerActions;

	public readonly tableState$: Observable<ITableState<ICustomer>> = this.store.select(CustomerState.tableState)
		.pipe(
			tap((tableState) => {
				this.changeDetectorRef.detectChanges();
			})
		);

}
