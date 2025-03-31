import {signalStore, withMethods, withProps, withState} from "@ngrx/signals";
import EBusinessProfile from "@tenant/business-profile/domain/entity/e.business-profile";
import {inject} from "@angular/core";
import {GetApi} from "@tenant/business-profile/infrastructure/data-source/api/get.api";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {Store} from "@ngxs/store";
import {
	BusinessProfileActions
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.actions";


export interface IBusinessProfileStore {
	item: EBusinessProfile | null;
}

const initialState: IBusinessProfileStore = {
	item: null,
};

export const BusinessProfileStore = signalStore(
	withState(initialState),
	withProps(() => ({
		getApiItem: inject(GetApi.Request),
		ngxsStore: inject(Store),
		sharedUow: inject(SharedUow),
	})),
	withMethods(({getApiItem, sharedUow, ngxsStore}) => ({
		async initBusinessProfileFromApi(tenant: string) {
			const businessProfileEntityRaw = await sharedUow.businessProfile.repository.findByIdAsync(tenant);
			if (businessProfileEntityRaw) {
				ngxsStore.dispatch(new BusinessProfileActions.Init());
				return EBusinessProfile.fromRaw(businessProfileEntityRaw);
			}
			const {items: {0: businessProfileDto}} = await getApiItem.executeAsync();
			if (!businessProfileDto) {
				// TODO Show error
				throw new Error("Didn't find business profile in server!")
			}
			const businessProfileEntity = EBusinessProfile.fromDTO(businessProfileDto);
			businessProfileEntity.initSyncedAt();
			await sharedUow.businessProfile.repository.createAsync(businessProfileEntity);
			ngxsStore.dispatch(new BusinessProfileActions.Init());
			return businessProfileEntity;
		}
	})),
);
