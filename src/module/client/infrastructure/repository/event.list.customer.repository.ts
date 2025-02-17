import {inject, Injectable} from '@angular/core';
import {TableState} from "@utility/domain/table.state";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import * as Customer from "@src/core/business-logic/customer";
import {NGXLogger} from "ngx-logger";
import {StateEnum} from "@core/shared/enum/state.enum";
import {CustomerService} from "@core/business-logic/customer/service/customer.service";

@Injectable({
	providedIn: 'root'
})
export class EventListCustomerRepository {

	private readonly logger = inject(NGXLogger);
	public readonly customerService = inject(CustomerService);
	public readonly tableState = TableState.create<Customer.ICustomer.Entity>({
		filters: {}
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

			const newTableState = this.tableState.toBackendFormat();

			const inState = [StateEnum.active, StateEnum.archived, StateEnum.inactive];

			const {items, totalSize} = await this.customerService.repository.findAsync({
				...newTableState,
				state: inState,
			});

			this.tableState
				.nextPage()
				.setItems(([] as Customer.ICustomer.Entity[]).concat(this.tableState.items, items))
				.setTotal(totalSize);

		} catch (e) {
			this.logger.error(e);
		}

		this.loading$.doFalse();

		return this;

	}

}
