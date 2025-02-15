import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";
import {
	AbsenceDexieAdapterIndexedDBDataProvider
} from "@absence/infrastructure/data-provider/indexedDB/adapter/absence.dexie.adapter.indexedDB.data-provider";

@Injectable()
export class AbsenceIndexedDBDataProvider extends IndexedDBDataProvider<IAbsence.Entity> {

	protected readonly entityFieldsToSearch = ['note'];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(AbsenceDexieAdapterIndexedDBDataProvider);

}
