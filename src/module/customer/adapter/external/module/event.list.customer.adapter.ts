import {inject, Injectable} from '@angular/core';
import {TableState} from "@utility/domain/table.state";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {ListCustomerApiAdapter} from "@customer/adapter/external/api/list.customer.api.adapter";
import * as Customer from "@customer/domain";
import {NGXLogger} from "ngx-logger";

@Injectable({
	providedIn: 'root'
})
export class EventListCustomerAdapter {

	private readonly logger = inject(NGXLogger);
	public readonly listCustomerApiAdapter = inject(ListCustomerApiAdapter);
	public readonly tableState = new TableState<Customer.ICustomer>();
	public readonly loading$ = new BooleanStreamState(false);

	public resetTableState(): void {

		this.tableState
			.setPage(1)
			.setTotal(0)
			.setItems([]);

	}

	/**
	 * GET PAGE
	 * Find data in tabelState
	 */
	public async getPageAsync(): Promise<void> {

		if (this.loading$.isOn) {
			return;
		}

		this.loading$.switchOn();

		try {

			const data = await this.listCustomerApiAdapter.executeAsync(this.tableState.toBackendFormat());

			this.tableState
				.nextPage()
				.setItems(([] as Customer.ICustomer[]).concat(this.tableState.items, data.items))
				.setTotal(data.totalSize);

		} catch (e) {
			this.logger.error(e);
		}

		this.loading$.switchOff();

	}

}
