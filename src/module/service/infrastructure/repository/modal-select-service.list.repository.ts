import {inject, Injectable} from "@angular/core";
import {TableState} from "@utility/domain/table.state";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {ActiveEnum} from "@core/shared/enum";
import {NGXLogger} from "ngx-logger";
import {StateEnum} from "@core/shared/enum/state.enum";
import {ServiceService} from "@core/business-logic/service/service/service.service";
import {IService} from "@core/business-logic/service/interface/i.service";

@Injectable()
export class ModalSelectServiceListRepository {

	private readonly logger = inject(NGXLogger);
	public readonly serviceService = inject(ServiceService);
	public readonly tableState = new TableState<IService.DTO>().setFilters({
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

			const inState = [StateEnum.active, StateEnum.archived, StateEnum.inactive];

			const {items, totalSize} = await this.serviceService.repository.findAsync({
				...params,
				state: inState,
			});

			this.tableState
				.nextPage()
				.setItems(([] as IService.DTO[]).concat(this.tableState.items, items))
				.setTotal(totalSize);

		} catch (e) {
			this.logger.error(e);
		}

		this.loading$.doFalse();

	}
}
