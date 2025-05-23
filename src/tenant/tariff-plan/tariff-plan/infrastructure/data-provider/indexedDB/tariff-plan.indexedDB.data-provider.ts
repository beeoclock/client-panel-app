import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import ETariffPlan from "@tenant/tariff-plan/tariff-plan/domain/entity/e.tariff-plan";
import {
	TariffPlanDexieAdapterIndexedDBDataProvider
} from "@tenant/tariff-plan/tariff-plan/infrastructure/data-provider/indexedDB/adapter/tariff-plan.dexie.adapter.indexedDB.data-provider";

@Injectable()
export class TariffPlanIndexedDBDataProvider extends IndexedDBDataProvider<ETariffPlan> {

	protected readonly entityFieldsToSearch = [];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(TariffPlanDexieAdapterIndexedDBDataProvider);

}
