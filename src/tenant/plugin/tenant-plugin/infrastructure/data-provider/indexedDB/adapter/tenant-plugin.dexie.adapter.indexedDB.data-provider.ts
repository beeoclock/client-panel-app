import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {ITenantPlugin} from "@tenant/plugin/tenant-plugin/domain";

@Injectable()
export class TenantPluginDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<ITenantPlugin.EntityRaw> {

	protected readonly columns = '_id,state,createdAt,updatedAt';
	protected readonly moduleName = 'tenant-plugin';
	protected readonly version = 1;

}
