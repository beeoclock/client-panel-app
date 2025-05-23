import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {IPlugin} from "@tenant/plugin/plugin/domain";

@Injectable()
export class PluginDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<IPlugin.EntityRaw> {

	protected readonly columns = '_id,state,createdAt,updatedAt';
	protected readonly moduleName = 'plugin';
	protected readonly version = 1;

}
