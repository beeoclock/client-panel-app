import {inject, Injectable} from '@angular/core';
import {TableState} from "@utility/domain/table.state";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {ListCustomerApiAdapter} from "@customer/adapter/external/api/list.customer.api.adapter";
import * as Customer from "@customer/domain";
import {convertFilters} from "@customer/utils";

@Injectable({
  providedIn: 'root'
})
export class UtilityListCustomerAdapter {

  public readonly listCustomerApiAdapter = inject(ListCustomerApiAdapter);
  public readonly tableState = new TableState<Customer.ICustomer>();
  public readonly loading$ = new BooleanStreamState(false);

  public resetTableState(): void {

    this.tableState.page = 1;
    this.tableState.total = 0;
    this.tableState.items = [];

  }

  // TODO add method to stop request

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
      convertFilters(filters, this.tableState.filters);

      const data = await this.listCustomerApiAdapter.executeAsync({
        ...this.tableState.toBackendFormat(),
        filters
      });

      if (data.items.length === this.tableState.pageSize || this.tableState.page > 1) {
        // Increment page
        this.tableState.page += 1;

        // Add items to tableState
        this.tableState.items = ([] as Customer.ICustomer[]).concat(this.tableState.items, data.items);
      } else {

        // Add items to tableState
        this.tableState.items = data.items;
      }

      this.tableState.total = data.totalSize;

    } catch (e) {
      console.error(e);
    }

    this.loading$.switchOff();

  }

}
