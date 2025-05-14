import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import EBalance from "@tenant/balance/domain/entity/e.balance";
import {
	BalanceDexieAdapterIndexedDBDataProvider
} from "@tenant/balance/infrastructure/data-provider/indexedDB/adapter/balance.dexie.adapter.indexedDB.data-provider";

@Injectable()
export class BalanceIndexedDBDataProvider extends IndexedDBDataProvider<EBalance> {

	protected readonly entityFieldsToSearch = ['action.systemComment', 'action.amount', 'action.currency', 'action.type'];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(BalanceDexieAdapterIndexedDBDataProvider);

}
