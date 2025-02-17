import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {IBusinessProfile} from "@core/business-logic/business-profile/interface/i.business-profile";
import {
	BusinessProfileDexieAdapterIndexedDBDataProvider
} from "@businessProfile/infrastructure/data-provider/indexedDB/adapter/business-profile.dexie.adapter.indexedDB.data-provider";

@Injectable()
export class BusinessProfileIndexedDBDataProvider extends IndexedDBDataProvider<IBusinessProfile.Entity> {

	protected readonly entityFieldsToSearch = [];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(BusinessProfileDexieAdapterIndexedDBDataProvider);

}
