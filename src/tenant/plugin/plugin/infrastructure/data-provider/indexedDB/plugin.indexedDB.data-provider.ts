import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {
	PluginDexieAdapterIndexedDBDataProvider
} from "@tenant/plugin/plugin/infrastructure/data-provider/indexedDB/adapter/plugin.dexie.adapter.indexedDB.data-provider";
import EPlugin from "@tenant/plugin/plugin/domain/entity/e.plugin-store";

@Injectable()
export class PluginIndexedDBDataProvider extends IndexedDBDataProvider<EPlugin> {

	protected readonly entityFieldsToSearch = [];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(PluginDexieAdapterIndexedDBDataProvider);

}
