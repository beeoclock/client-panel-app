import {inject, Injectable} from '@angular/core';
import {ListMemberApiAdapter} from "@member/adapter/external/api/list.member.api.adapter";
import {TableState} from "@utility/domain/table.state";
import * as Member from "@member/domain";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {NGXLogger} from "ngx-logger";

@Injectable({
  providedIn: 'root'
})
export class ModalSelectSpecialistListAdapter {

  private readonly logger = inject(NGXLogger);
  public readonly listMemberApiAdapter = inject(ListMemberApiAdapter);
  public readonly tableState = new TableState<Member.IMember>();
  public readonly loading$ = new BooleanStreamState(false);

  public resetTableState(): void {

    this.tableState.page = 1;
    this.tableState.total = 0;
    this.tableState.items = [];

  }

  /**
   * GET PAGE
   * Find data in tabelState
   */
  public async getPageAsync(): Promise<void> {

    if (this.loading$.isOn) {
      return;
    }

    this.loading$.switchOn();

    try {

      const data = await this.listMemberApiAdapter.executeAsync(this.tableState.toBackendFormat());

      // Increment page
      this.tableState.page += 1;

      // Add items to tableState
      this.tableState.items = ([] as Member.IMember[]).concat(this.tableState.items, data.items);
      this.tableState.total = data.totalSize;

    } catch (e) {
			this.logger.error(e);
    }

    this.loading$.switchOff();

  }

}
