import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import ETariffPlanHistory from "@tenant/tariff-plan/tariff-plan-history/domain/entity/e.tariff-plan-history";
import {
	TariffPlanHistoryDexieAdapterIndexedDBDataProvider
} from "@tenant/tariff-plan/tariff-plan-history/infrastructure/data-provider/indexedDB/adapter/tariff-plan-history.dexie.adapter.indexedDB.data-provider";

@Injectable()
export class TariffPlanHistoryIndexedDBDataProvider extends IndexedDBDataProvider<ETariffPlanHistory> {

	protected readonly entityFieldsToSearch = [];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(TariffPlanHistoryDexieAdapterIndexedDBDataProvider);

}
