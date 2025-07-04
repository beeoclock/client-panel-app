import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import ERole from "@tenant/member/roles/domain/entity/e.role";
import {
	RoleDexieAdapterIndexedDBDataProvider
} from "@tenant/member/roles/infrastructure/data-provider/indexedDB/adapter/role.dexie.adapter.indexedDB.data-provider";

@Injectable()
export class RoleIndexedDBDataProvider extends IndexedDBDataProvider<ERole> {

	protected readonly entityFieldsToSearch = ['name'];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(RoleDexieAdapterIndexedDBDataProvider);

}
