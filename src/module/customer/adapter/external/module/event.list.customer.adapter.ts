import {inject, Injectable} from '@angular/core';
import {TableState} from "@utility/domain/table.state";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {ListCustomerApiAdapter} from "@customer/adapter/external/api/list.customer.api.adapter";
import * as Customer from "@customer/domain";

@Injectable({
  providedIn: 'root'
})
export class EventListCustomerAdapter {

  public readonly listCustomerApiAdapter = inject(ListCustomerApiAdapter);
  public readonly tableState = new TableState<Customer.ICustomer>();
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

    this.loading$.switchOn();

    try {

      const filters: any = {};

      const data = await this.listCustomerApiAdapter.executeAsync({
        ...this.tableState.toBackendFormat(),
        filters
      });

      // Increment page
      this.tableState.page += 1;

      // Add items to tableState
      this.tableState.items = ([] as Customer.ICustomer[]).concat(this.tableState.items, data.items);
      this.tableState.total = data.totalSize;

    } catch (e) {
      console.error(e);
    }

    this.loading$.switchOff();

  }

}
