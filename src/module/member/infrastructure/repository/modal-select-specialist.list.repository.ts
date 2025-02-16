import {inject, Injectable} from '@angular/core';
import {GetApi} from "@member/infrastructure/api/get.api";
import {TableState} from "@utility/domain/table.state";
import * as Member from "@src/core/business-logic/member";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {NGXLogger} from "ngx-logger";

@Injectable({
  providedIn: 'root'
})
export class ModalSelectSpecialistListRepository {

  private readonly logger = inject(NGXLogger);
  public readonly listMemberApiAdapter = inject(GetApi);
  public readonly tableState = new TableState<Member.RIMember>();
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

      const data = await this.listMemberApiAdapter.executeAsync(this.tableState.toBackendFormat());

      this.tableState
				.nextPage()
				.setItems(([] as Member.RIMember[]).concat(this.tableState.items, data.items))
				.setTotal(data.totalSize);

    } catch (e) {
			this.logger.error(e);
    }

    this.loading$.doFalse();

  }

}
