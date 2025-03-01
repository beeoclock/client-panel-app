import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {
	AbsenceDexieAdapterIndexedDBDataProvider
} from "@absence/infrastructure/data-provider/indexedDB/adapter/absence.dexie.adapter.indexedDB.data-provider";
import EAbsence from "@core/business-logic/absence/entity/e.absence";

@Injectable()
export class AbsenceIndexedDBDataProvider extends IndexedDBDataProvider<EAbsence> {

	protected readonly entityFieldsToSearch = ['note'];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(AbsenceDexieAdapterIndexedDBDataProvider);

}
