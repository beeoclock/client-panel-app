import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {
	BusinessProfileDexieAdapterIndexedDBDataProvider
} from "@businessProfile/infrastructure/data-provider/indexedDB/adapter/business-profile.dexie.adapter.indexedDB.data-provider";
import EBusinessProfile from "@core/business-logic/business-profile/entity/e.business-profile";

@Injectable()
export class BusinessProfileIndexedDBDataProvider extends IndexedDBDataProvider<EBusinessProfile> {

	protected readonly entityFieldsToSearch = [];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(BusinessProfileDexieAdapterIndexedDBDataProvider);

}
