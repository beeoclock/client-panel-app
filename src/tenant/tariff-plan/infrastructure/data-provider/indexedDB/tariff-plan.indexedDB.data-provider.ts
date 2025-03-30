import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import ETariffPlan from "@core/business-logic/tariif-plan/entity/e.tariff-plan";
import {
	TariffPlanDexieAdapterIndexedDBDataProvider
} from "@tenant/tariff-plan/infrastructure/data-provider/indexedDB/adapter/tariff-plan.dexie.adapter.indexedDB.data-provider";

@Injectable()
export class TariffPlanIndexedDBDataProvider extends IndexedDBDataProvider<ETariffPlan> {

	protected readonly entityFieldsToSearch = [];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(TariffPlanDexieAdapterIndexedDBDataProvider);

}
