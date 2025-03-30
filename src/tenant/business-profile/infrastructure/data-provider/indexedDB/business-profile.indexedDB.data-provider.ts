import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {
	BusinessProfileDexieAdapterIndexedDBDataProvider
} from "@tenant/business-profile/infrastructure/data-provider/indexedDB/adapter/business-profile.dexie.adapter.indexedDB.data-provider";
import EBusinessProfile from "@tenant/business-profile/domain/entity/e.business-profile";

@Injectable()
export class BusinessProfileIndexedDBDataProvider extends IndexedDBDataProvider<EBusinessProfile> {

	protected readonly entityFieldsToSearch = [];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(BusinessProfileDexieAdapterIndexedDBDataProvider);

}
