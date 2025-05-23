import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {IRole} from "@tenant/member/roles/domain";

@Injectable()
export class RoleDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<IRole.EntityRaw> {

	protected readonly columns = '_id,state,createdAt,updatedAt,isOwner,name';
	protected readonly moduleName = 'role';
	protected readonly version = 1;

}
