import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {
	ServiceDexieAdapterIndexedDBDataProvider
} from "@[tenant]/service/infrastructure/data-provider/indexedDB/adapter/service.dexie.adapter.indexedDB.data-provider";
import EService from "@core/business-logic/service/entity/e.service";

@Injectable()
export class ServiceIndexedDBDataProvider extends IndexedDBDataProvider<EService> {

	protected readonly entityFieldsToSearch = [
		'languageVersions.title',
		'languageVersions.description',
	];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(ServiceDexieAdapterIndexedDBDataProvider);

}
