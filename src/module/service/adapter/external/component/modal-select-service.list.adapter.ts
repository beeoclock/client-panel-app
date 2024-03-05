import {inject, Injectable} from "@angular/core";
import {TableState} from "@utility/domain/table.state";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {ListServiceApiAdapter} from "@service/adapter/external/api/list.service.api.adapter";
import * as Service from "@service/domain";
import {ActiveEnum} from "@utility/domain/enum";
import {NGXLogger} from "ngx-logger";

@Injectable({
	providedIn: 'root'
})
export class ModalSelectServiceListAdapter {

	private readonly logger = inject(NGXLogger);
	public readonly listServiceApiAdapter = inject(ListServiceApiAdapter);
	public readonly tableState = new TableState<Service.IService>().setFilters({
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

			const data = await this.listServiceApiAdapter.executeAsync(this.tableState.toBackendFormat());

			this.tableState
				.nextPage()
				.setItems(([] as Service.IService[]).concat(this.tableState.items, data.items))
				.setTotal(data.totalSize);

		} catch (e) {
			this.logger.error(e);
		}

		this.loading$.doFalse();

	}
}
