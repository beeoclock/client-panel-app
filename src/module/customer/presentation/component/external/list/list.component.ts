import {ChangeDetectionStrategy, Component, inject, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ListPage} from "@utility/list.page";
import {Observable, tap} from "rxjs";
import {ITableState} from "@utility/domain/table.state";
import {ICustomer} from "@customer/domain";
import {
	MobileLayoutListComponent
} from "@customer/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@customer/presentation/component/list/layout/desktop/desktop.layout.list.component";
import ECustomer from "@core/entity/e.customer";
import {toObservable} from "@angular/core/rxjs-interop";
import {BaseActions} from "@utility/state/base/base.actions";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";

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
	// providers: [
	// 	{
	// 		provide: TableService,
	// 		useClass: CustomerTableService
	// 	}
	// ]
})
export class CustomerExternalListComponent extends ListPage<ICustomer> {

	@ViewChildren(MobileLayoutListComponent)
	public mobileLayoutListComponents!: QueryList<MobileLayoutListComponent>;

	private readonly customerStore = inject(ECustomer.store);
	public readonly tableState$: Observable<ITableState<ICustomer>> = toObservable(this.customerStore.tableState)
		.pipe(
			tap((tableState) => {
				this.changeDetectorRef.detectChanges();
			})
		);

	public override ngOnInit(): void {
		let params = undefined;
		if (this.getListParams) {
			params = {
				queryParams: this.getListParams,
				...BaseActions.GetList.defaultPayload
			};
		}
		this.customerStore.getItems(params);
		this.initialized.switchOn();
		this.changeDetectorRef.detectChanges();
	}

	public readonly showAction = new BooleanStreamState(true);
	public readonly showSelectedStatus = new BooleanStreamState(false);

	public pageChange($event: number) {
		this.customerStore.updateTableState({
			page: $event
		});
		this.customerStore.getItems();
	}

}
