import {inject, Injectable} from '@angular/core';
import {TableState} from "@utility/domain/table.state";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import * as Customer from "@src/core/business-logic/customer";
import {NGXLogger} from "ngx-logger";
import {CustomerIndexedDBFacade} from "@customer/infrastructure/facade/indexedDB/customer.indexedDB.facade";
import {StateEnum} from "@utility/domain/enum/state.enum";

@Injectable({
	providedIn: 'root'
})
export class EventListCustomerRepository {

	private readonly logger = inject(NGXLogger);
	public readonly customerIndexedDBFacade = inject(CustomerIndexedDBFacade);
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

			const phraseFields = ['firstName', 'lastName', 'phone', 'email']

			const newTableState = this.tableState.toBackendFormat();

			const selector = {
				$and: [
					...((newTableState?.phrase as string)?.length ? [{
						$or: phraseFields.map((field) => {
							return {
								[field]: {
									$regex: newTableState.phrase,
									$options: "i"
								}
							}
						})
					}] : []),
					{
						state: {
							$in: [StateEnum.active, StateEnum.archived, StateEnum.inactive]
						}
					}
				]
			};

			const data = this.customerIndexedDBFacade.source.find(selector, {
				limit: newTableState.pageSize,
				skip: (newTableState.page - 1) * newTableState.pageSize
			}).fetch();

			this.tableState
				.nextPage()
				.setItems(([] as Customer.ICustomer.Entity[]).concat(this.tableState.items, data))
				.setTotal(this.customerIndexedDBFacade.source.find(selector).count());

		} catch (e) {
			this.logger.error(e);
		}

		this.loading$.doFalse();

		return this;

	}

}
