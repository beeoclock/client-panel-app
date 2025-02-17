import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {IService} from "@core/business-logic/service/interface/i.service";
import {
	ServiceDexieAdapterIndexedDBDataProvider
} from "@service/infrastructure/data-provider/indexedDB/adapter/service.dexie.adapter.indexedDB.data-provider";

@Injectable()
export class ServiceIndexedDBDataProvider extends IndexedDBDataProvider<IService.Entity> {

	protected readonly entityFieldsToSearch = [
		'languageVersions.title',
		'languageVersions.description',
	];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(ServiceDexieAdapterIndexedDBDataProvider);

}
