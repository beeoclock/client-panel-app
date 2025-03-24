import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {ITariffPlanHistory} from "@core/business-logic/tariif-plan-history/interface/i.tariff-plan-history";

@Injectable()
export class TariffPlanHistoryDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<ITariffPlanHistory.EntityRaw> {

	protected readonly columns = '_id,state,status,createdAt,updatedAt';
	protected readonly moduleName = 'tariff-plan-history';
	protected readonly version = 1;

}
