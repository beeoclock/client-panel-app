import {inject, Injectable} from "@angular/core";
import {State} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import * as Customer from "@customer/domain";
import {ArchiveCustomerApiAdapter} from "@customer/adapter/external/api/archive.customer.api.adapter";
import {CreateCustomerApiAdapter} from "@customer/adapter/external/api/create.customer.api.adapter";
import {UpdateCustomerApiAdapter} from "@customer/adapter/external/api/update.customer.api.adapter";
import {ItemCustomerApiAdapter} from "@customer/adapter/external/api/item.customer.api.adapter";
import {RemoveCustomerApiAdapter} from "@customer/adapter/external/api/remove.customer.api.adapter";
import {ListCustomerApiAdapter} from "@customer/adapter/external/api/list.customer.api.adapter";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {UnarchiveCustomerApiAdapter} from "@customer/adapter/external/api/unarchive.customer.api.adapter";
import {TranslateService} from "@ngx-translate/core";
// import {SyncCustomerTenantDatabaseService} from "@customer/database/tenant/sync.customer.tenant.database.service";

export type ICustomerState = IBaseState<Customer.ICustomer>;

const defaults = baseDefaults<Customer.ICustomer>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: 20
});

@State<ICustomerState>({
	name: 'customer',
	defaults,
})
@Injectable()
export class CustomerState extends BaseState<Customer.ICustomer> {

	protected override readonly archive = inject(ArchiveCustomerApiAdapter);
	protected override readonly unarchive = inject(UnarchiveCustomerApiAdapter);
	protected override readonly create = inject(CreateCustomerApiAdapter);
	protected override readonly update = inject(UpdateCustomerApiAdapter);
	protected override readonly item = inject(ItemCustomerApiAdapter);
	protected override readonly delete = inject(RemoveCustomerApiAdapter);
	protected override readonly paged = inject(ListCustomerApiAdapter);

	private readonly translateService = inject(TranslateService);

	// private readonly customerTenantDatabaseService = inject(CustomerTenantDatabaseService);
	// private readonly syncCustomerTenantDatabaseService = inject(SyncCustomerTenantDatabaseService);


	constructor() {
		super(
			defaults,
		);
	}

	// Selectors


}
