import {inject, Injectable} from '@angular/core';
import {TableState} from "@shared/domain/table.state";
import {BooleanStreamState} from "@shared/domain/boolean-stream.state";
import {NGXLogger} from "ngx-logger";
import {StateEnum} from "@core/shared/enum/state.enum";
import {IMember} from "@tenant/member/domain/interface/i.member";
import {SharedUow} from "@core/shared/uow/shared.uow";

@Injectable({
	providedIn: 'root'
})
export class ModalSelectSpecialistListRepository {

	private readonly logger = inject(NGXLogger);
	private readonly sharedUow = inject(SharedUow);
	public readonly tableState = new TableState<IMember.EntityRaw>();
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

			const inState = [StateEnum.active, StateEnum.archived, StateEnum.inactive];

			const {items, totalSize} = await this.sharedUow.member.repository.findAsync({
				...this.tableState.toBackendFormat(),
				state: inState,
			});

			this.tableState
				.nextPage()
				.setItems(([] as IMember.EntityRaw[]).concat(this.tableState.items, items))
				.setTotal(totalSize);

		} catch (e) {
			this.logger.error(e);
		}

		this.loading$.doFalse();

	}

}
