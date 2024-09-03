import {inject, Injectable} from '@angular/core';
import {TableState} from "@utility/domain/table.state";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {ListCustomerApiAdapter} from "@customer/adapter/external/api/list.customer.api.adapter";
import * as Customer from "@customer/domain";
import {NGXLogger} from "ngx-logger";
import {ActiveEnum} from "@utility/domain/enum";

@Injectable({
	providedIn: 'root'
})
export class EventListCustomerAdapter {

	private readonly logger = inject(NGXLogger);
	public readonly listCustomerApiAdapter = inject(ListCustomerApiAdapter);
	public readonly tableState = TableState.create<Customer.ICustomer>({
		filters: {
			active: ActiveEnum.YES
		}
	});
	public readonly loading$ = new BooleanStreamState(false);

	public resetTableState() {

		this.tableState
			.setPage(1)
			.setTotal(0)
			.setItems([]);

		return this;

	}

	public filterByPhrase(phrase: string) {

		this.tableState
			.setPage(1)
			.setTotal(0)
			.setItems([])
			.patchFilters({phrase});

		return this;

	}

	/**
	 * GET PAGE
	 * Find data in tabelState
	 */
	public async getPageAsync() {

		if (this.loading$.isTrue) {
			return;
		}

		this.loading$.doTrue();

		try {

			const data = await this.listCustomerApiAdapter.executeAsync(this.tableState.toBackendFormat());

			this.tableState
				.nextPage()
				.setItems(([] as Customer.ICustomer[]).concat(this.tableState.items, data.items))
				.setTotal(data.totalSize);

		} catch (e) {
			this.logger.error(e);
		}

		this.loading$.doFalse();

		return this;

	}

}
