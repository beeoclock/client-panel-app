import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {IBusinessProfile} from "@core/business-logic/business-profile/interface/i.business-profile";

@Injectable()
export class BusinessProfileDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<IBusinessProfile.EntityRaw> {

	protected readonly columns = '_id,updatedAt,createdAt';
	protected readonly moduleName = 'businessProfile';
	protected readonly version = 1;

}
