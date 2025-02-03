import {inject, Injectable} from "@angular/core";
import {TableService} from "@utility/table.service";
import {ICustomer} from "@customer/domain";
import ECustomer from "@core/entity/e.customer";

@Injectable()
export class CustomerTableService extends TableService<ICustomer> {
	private readonly customerStore = inject(ECustomer.store);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	public override readonly actions = {
		GetList: this.customerStore.getItems,
		UpdateTableState: this.customerStore.updateTableState
	};
}
