import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {IBusinessProfile} from "@tenant/business-profile/domain/interface/i.business-profile";

@Injectable()
export class BusinessProfileDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<IBusinessProfile.EntityRaw> {

	protected readonly columns = '_id,state,updatedAt,createdAt';
	protected readonly moduleName = 'businessProfile';
	protected readonly version = 1;

}
