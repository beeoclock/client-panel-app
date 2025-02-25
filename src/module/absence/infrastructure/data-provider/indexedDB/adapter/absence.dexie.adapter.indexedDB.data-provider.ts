import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";

@Injectable()
export class AbsenceDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<IAbsence.EntityRaw> {

	protected readonly columns = '_id,createdAt,updatedAt,start,end';
	protected readonly moduleName = 'absence';
	protected readonly version = 1;

}
