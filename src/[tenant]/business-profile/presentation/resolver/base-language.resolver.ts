import {ResolveFn} from "@angular/router";
import {inject} from "@angular/core";
import {filter, take} from "rxjs";
import {is} from "@core/shared/checker";
import {
	BusinessProfileState
} from "@[tenant]/business-profile/presentation/state/business-profile/business-profile.state";
import {Store} from "@ngxs/store";
import {LanguageCodeEnum} from "@core/shared/enum";


export const baseLanguageResolver: ResolveFn<LanguageCodeEnum> = () => {

	const store = inject(Store);

	return store.select(BusinessProfileState.baseLanguage)
		.pipe(
			filter(is.string_not_empty<LanguageCodeEnum>),
			take(1),
		);

};
