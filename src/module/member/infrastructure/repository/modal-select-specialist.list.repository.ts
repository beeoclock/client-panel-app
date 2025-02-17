import {inject, Injectable} from '@angular/core';
import {TableState} from "@utility/domain/table.state";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {NGXLogger} from "ngx-logger";
import {StateEnum} from "@core/shared/enum/state.enum";
import {MemberService} from "@core/business-logic/member/service/member.service";
import {IMember} from "@core/business-logic/member/interface/i.member";

@Injectable({
	providedIn: 'root'
})
export class ModalSelectSpecialistListRepository {

	private readonly logger = inject(NGXLogger);
	private readonly memberService = inject(MemberService);
	public readonly tableState = new TableState<IMember.Entity>();
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

			const {items, totalSize} = await this.memberService.repository.findAsync({
				...this.tableState.toBackendFormat(),
				state: inState,
			});

			this.tableState
				.nextPage()
				.setItems(([] as IMember.Entity[]).concat(this.tableState.items, items))
				.setTotal(totalSize);

		} catch (e) {
			this.logger.error(e);
		}

		this.loading$.doFalse();

	}

}
