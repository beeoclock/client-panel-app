import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {IMember} from "@core/business-logic/member/interface/i.member";
import {
	MemberDexieAdapterIndexedDBDataProvider
} from "@member/infrastructure/data-provider/indexedDB/adapter/member.dexie.adapter.indexedDB.data-provider";

@Injectable()
export class MemberIndexedDBDataProvider extends IndexedDBDataProvider<IMember.Entity> {

	protected readonly entityFieldsToSearch = ['firstName', 'lastName', 'email', 'phone'];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(MemberDexieAdapterIndexedDBDataProvider);

}
