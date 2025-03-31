import {inject, Injectable} from '@angular/core';
import {TableState} from "@shared/domain/table.state";
import {BooleanStreamState} from "@shared/domain/boolean-stream.state";
import * as Customer from "@tenant/customer/domain";
import {NGXLogger} from "ngx-logger";
import {SharedUow} from "@core/shared/uow/shared.uow";

@Injectable()
export class UtilityListCustomerRepository {

	private readonly logger = inject(NGXLogger);
	public readonly sharedUow = inject(SharedUow);
	public readonly tableState = new TableState<Customer.ICustomer.EntityRaw>();
	public readonly loading$ = new BooleanStreamState(false);

	public resetTableState(): void {

		this.tableState.setPage(1).setTotal(0).setItems([]);

	}

	// TODO add method to stop request

	/**
	 * GET PAGE
	 * Find data in tabelState
	 */
	public async getPageAsync(): Promise<void> {

		if (this.loading$.isTrue) {
			return;
		}

		this.loading$.doTrue();
		// TODO

		// try {
		//
		// 	const params = this.tableState.toBackendFormat();
		// 	const data = this.customerIndexedDBFacade.source.find();
		//
		// 	if (data.items.length === this.tableState.pageSize || this.tableState.page > 1) {
		// 		this.tableState.nextPage().setItems(([] as Customer.ICustomer[]).concat(this.tableState.items, data.items))
		// 	} else {
		//
		// 		// Add items to tableState
		// 		this.tableState.setItems(data.items);
		// 	}
		//
		// 	this.tableState.setTotal(data.totalSize);
		//
		// } catch (e) {
		// 	this.logger.error(e);
		// }

		this.loading$.doFalse();

	}

}
