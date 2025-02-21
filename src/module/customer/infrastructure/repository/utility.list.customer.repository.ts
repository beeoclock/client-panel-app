import {inject, Injectable} from '@angular/core';
import {TableState} from "@utility/domain/table.state";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import * as Customer from "@src/core/business-logic/customer";
import {NGXLogger} from "ngx-logger";
import {CustomerService} from "@core/business-logic/customer/service/customer.service";

@Injectable()
export class UtilityListCustomerRepository {

	private readonly logger = inject(NGXLogger);
	public readonly customerService = inject(CustomerService);
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
