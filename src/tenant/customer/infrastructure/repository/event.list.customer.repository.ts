import {inject, Injectable} from '@angular/core';
import {TableState} from "@shared/domain/table.state";
import {BooleanStreamState} from "@shared/domain/boolean-stream.state";
import * as Customer from "@tenant/customer/domain";
import {NGXLogger} from "ngx-logger";
import {StateEnum} from "@core/shared/enum/state.enum";
import {SharedUow} from "@core/shared/uow/shared.uow";

@Injectable()
export class EventListCustomerRepository {

	private readonly logger = inject(NGXLogger);
	public readonly sharedUow = inject(SharedUow);
	public readonly tableState = TableState.create<Customer.ICustomer.EntityRaw>({
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

			const inState = [StateEnum.active];

			const {items, totalSize} = await this.sharedUow.customer.repository.findAsync({
				...newTableState,
				state: inState,
			});

			this.tableState
				.nextPage()
				.setItems(([] as Customer.ICustomer.EntityRaw[]).concat(this.tableState.items, items))
				.setTotal(totalSize);

		} catch (e) {
			this.logger.error(e);
		}

		this.loading$.doFalse();

		return this;

	}

}
