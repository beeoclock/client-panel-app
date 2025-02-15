import {inject, Injectable} from "@angular/core";
import {TableState} from "@utility/domain/table.state";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {ActiveEnum, OrderDirEnum} from "src/core/shared/enum";
import {NGXLogger} from "ngx-logger";
import {IServiceDto} from "@src/core/business-logic/order/interface/i.service.dto";
import {ServiceIndexedDBFacade} from "@service/infrastructure/facade/indexedDB/service.indexedDB.facade";
import {StateEnum} from "@core/shared/enum/state.enum";

@Injectable({
	providedIn: 'root'
})
export class ModalSelectServiceListRepository {

	private readonly logger = inject(NGXLogger);
	public readonly serviceIndexedDBFacade = inject(ServiceIndexedDBFacade);
	public readonly tableState = new TableState<IServiceDto>().setFilters({
		active: ActiveEnum.YES
	});
	public readonly loading$ = new BooleanStreamState(false);

	public resetTableState(): void {

		this.tableState.setPage(1).setTotal(0).setItems([]);

	}

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

			const params = this.tableState.toBackendFormat();

			const selector = {
				$and: [
					{
						state: {
							$in: [StateEnum.active, StateEnum.archived, StateEnum.inactive]
						}
					}
				]
			};

			const items = this.serviceIndexedDBFacade.source.find(selector, {
				limit: params.pageSize,
				skip: (params.page - 1) * params.pageSize,
				sort: {
					[params.orderBy]: params.orderDir === OrderDirEnum.ASC ? 1 : -1
				}
			}).fetch();

			const total = this.serviceIndexedDBFacade.source.find(selector).count();

			this.tableState
				.nextPage()
				.setItems(([] as IServiceDto[]).concat(this.tableState.items, items))
				.setTotal(total);

		} catch (e) {
			this.logger.error(e);
		}

		this.loading$.doFalse();

	}
}
