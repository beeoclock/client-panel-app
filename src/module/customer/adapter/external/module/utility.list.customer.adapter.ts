import {inject, Injectable} from '@angular/core';
import {TableState} from "@utility/domain/table.state";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {ListCustomerApiAdapter} from "@customer/adapter/external/api/list.customer.api.adapter";
import * as Customer from "@customer/domain";
import {NGXLogger} from "ngx-logger";

@Injectable({
	providedIn: 'root'
})
export class UtilityListCustomerAdapter {

	private readonly logger = inject(NGXLogger);
	public readonly listCustomerApiAdapter = inject(ListCustomerApiAdapter);
	public readonly tableState = new TableState<Customer.ICustomer>();
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

		try {

			const data = await this.listCustomerApiAdapter.executeAsync(this.tableState.toBackendFormat());

			if (data.items.length === this.tableState.pageSize || this.tableState.page > 1) {
				this.tableState.nextPage().setItems(([] as Customer.ICustomer[]).concat(this.tableState.items, data.items))
			} else {

				// Add items to tableState
				this.tableState.setItems(data.items);
			}

			this.tableState.setTotal(data.totalSize);

		} catch (e) {
			this.logger.error(e);
		}

		this.loading$.doFalse();

	}

}
