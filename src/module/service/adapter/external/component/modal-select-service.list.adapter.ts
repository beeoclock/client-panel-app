import {inject, Injectable} from "@angular/core";
import {TableState} from "@utility/domain/table.state";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {ListServiceApiAdapter} from "@service/adapter/external/api/list.service.api.adapter";
import * as Service from "@service/domain";

@Injectable({
  providedIn: 'root'
})
export class ModalSelectServiceListAdapter {

  public readonly listServiceApiAdapter = inject(ListServiceApiAdapter);
  public readonly tableState = new TableState<Service.IService>();
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

      const filters: any = {};

      const data = await this.listServiceApiAdapter.executeAsync({
        ...this.tableState.toBackendFormat(),
        filters
      });

      // Increment page
      this.tableState.page += 1;

      // Add items to tableState
      this.tableState.items = ([] as Service.IService[]).concat(this.tableState.items, data.items);
      this.tableState.total = data.totalSize;

    } catch (e) {
      console.error(e);
    }

    this.loading$.switchOff();

  }
}
