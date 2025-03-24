import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {IService} from "@core/business-logic/service/interface/i.service";

@Injectable()
export class ServiceDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<IService.EntityRaw> {

	protected readonly columns = '_id,state,createdAt,updatedAt,order';
	protected readonly moduleName = 'service';
	protected readonly version = 1;

}
