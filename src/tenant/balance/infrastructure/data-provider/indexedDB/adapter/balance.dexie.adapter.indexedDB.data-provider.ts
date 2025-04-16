import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {IBalance} from "@tenant/balance/domain";

@Injectable()
export class BalanceDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<IBalance.EntityRaw> {

	protected readonly columns = '_id,state,createdAt,updatedAt,action.amount,action.type,action.systemComment,action.currency,amountAfterAction,amountBeforeAction';
	protected readonly moduleName = 'balance';
	protected readonly version = 1;

}
