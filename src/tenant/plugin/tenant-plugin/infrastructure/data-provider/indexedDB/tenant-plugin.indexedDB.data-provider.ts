import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import ETenantPlugin from "@tenant/plugin/tenant-plugin/domain/entity/e.tenant-plugin";
import {
	TenantPluginDexieAdapterIndexedDBDataProvider
} from "@tenant/plugin/tenant-plugin/infrastructure/data-provider/indexedDB/adapter/tenant-plugin.dexie.adapter.indexedDB.data-provider";

@Injectable()
export class TenantPluginIndexedDBDataProvider extends IndexedDBDataProvider<ETenantPlugin> {

	protected readonly entityFieldsToSearch = [];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(TenantPluginDexieAdapterIndexedDBDataProvider);

}
