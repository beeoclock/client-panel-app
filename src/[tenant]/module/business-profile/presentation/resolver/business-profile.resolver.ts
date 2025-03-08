import {ResolveFn} from "@angular/router";
import {inject} from "@angular/core";
import {filter, switchMap, take, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {BusinessProfileState} from "@businessProfile/infrastructure/state/business-profile/business-profile.state";
import {Store} from "@ngxs/store";
import EBusinessProfile from "@core/business-logic/business-profile/entity/e.business-profile";
import {BusinessProfileActions} from "@businessProfile/infrastructure/state/business-profile/business-profile.actions";


export const businessProfileResolver: ResolveFn<EBusinessProfile> = () => {

	const store = inject(Store);

	return store.dispatch(new BusinessProfileActions.Init()).pipe(
		switchMap(() => store.select(BusinessProfileState.item)
			.pipe(
				tap((result) => console.log({result})),
				filter(is.object_not_empty<EBusinessProfile>),
				take(1),
			)
		),
	);

};
