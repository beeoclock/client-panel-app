import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {IMember} from "@tenant/member/domain/interface/i.member";

@Injectable()
export class MemberDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<IMember.EntityRaw> {

	protected readonly columns = '_id,state,createdAt,updatedAt,firstName,lastName,email,phone';
	protected readonly moduleName = 'member';
	protected readonly version = 1;

}
