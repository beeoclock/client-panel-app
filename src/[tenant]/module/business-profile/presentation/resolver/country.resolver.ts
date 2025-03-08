import {ResolveFn} from "@angular/router";
import {inject} from "@angular/core";
import {filter, take, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {CountryCodeEnum} from "@core/shared/enum/country-code.enum";
import {BusinessProfileState} from "@businessProfile/infrastructure/state/business-profile/business-profile.state";
import {Store} from "@ngxs/store";


export const countryResolver: ResolveFn<CountryCodeEnum> = () => {

	const store = inject(Store);

	return store.select(BusinessProfileState.country)
		.pipe(
			tap((result) => console.log({result})),
			filter(is.string_not_empty<CountryCodeEnum>),
			take(1),
		);

};
