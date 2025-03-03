import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {ITariffPlan} from "@core/business-logic/tariif-plan/interface/i.tariff-plan";

@Injectable()
export class TariffPlanDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<ITariffPlan.EntityRaw> {

	protected readonly columns = '_id,createdAt,updatedAt';
	protected readonly moduleName = 'tariff-plan';
	protected readonly version = 1;

}
