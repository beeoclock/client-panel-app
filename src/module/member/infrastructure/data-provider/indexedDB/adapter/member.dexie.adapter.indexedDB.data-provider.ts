import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {IMember} from "@core/business-logic/member/interface/i.member";

@Injectable()
export class MemberDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<IMember.Entity> {

	protected readonly columns = '_id,createdAt,updatedAt,firstName,lastName,email,phone';
	protected readonly moduleName = 'member';
	protected readonly version = 1;

}
