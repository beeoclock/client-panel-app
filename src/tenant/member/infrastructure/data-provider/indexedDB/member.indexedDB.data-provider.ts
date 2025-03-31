import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {
	MemberDexieAdapterIndexedDBDataProvider
} from "@tenant/member/infrastructure/data-provider/indexedDB/adapter/member.dexie.adapter.indexedDB.data-provider";
import EMember from "@tenant/member/domain/entity/e.member";

@Injectable()
export class MemberIndexedDBDataProvider extends IndexedDBDataProvider<EMember> {

	protected readonly entityFieldsToSearch = ['firstName', 'lastName', 'email', 'phone'];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(MemberDexieAdapterIndexedDBDataProvider);

}
