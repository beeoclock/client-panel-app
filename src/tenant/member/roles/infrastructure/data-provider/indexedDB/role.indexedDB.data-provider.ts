import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {
	MemberDexieAdapterIndexedDBDataProvider
} from "@tenant/member/member/infrastructure/data-provider/indexedDB/adapter/member.dexie.adapter.indexedDB.data-provider";
import ERole from "@tenant/member/roles/domain/entity/e.role";

@Injectable()
export class RoleIndexedDBDataProvider extends IndexedDBDataProvider<ERole> {

	protected readonly entityFieldsToSearch = ['name'];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(MemberDexieAdapterIndexedDBDataProvider);

}
