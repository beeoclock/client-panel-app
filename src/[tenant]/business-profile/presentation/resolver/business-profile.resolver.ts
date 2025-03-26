import {ResolveFn} from "@angular/router";
import {inject} from "@angular/core";
import {filter, from, switchMap} from "rxjs";
import {is} from "@core/shared/checker";
import EBusinessProfile from "@core/business-logic/business-profile/entity/e.business-profile";
import {
	BusinessProfileStore
} from "@[tenant]/business-profile/presentation/store/business-profile/business-profile.store";
import {TENANT_ID} from "@src/token";


export const businessProfileResolver: ResolveFn<EBusinessProfile> = () => {

	const tenantId$ = inject(TENANT_ID);
	const businessProfileStore = inject(BusinessProfileStore);

	return tenantId$.pipe(
		filter(is.string_not_empty<string>),
		switchMap((tenant) => from(businessProfileStore.initBusinessProfileFromApi(tenant)))
	);

};
