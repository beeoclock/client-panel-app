import {ResolveFn} from "@angular/router";
import {IdentityState} from "@identity/state/identity/identity.state";
import {inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {filter} from "rxjs";
import {IdTokenResult} from "@angular/fire/auth";
import {is} from "@utility/checker";


export const tokenResolver: ResolveFn<IdTokenResult | undefined> = () => {

	const store = inject(Store);

	return store.select(IdentityState.token).pipe(
		filter((token) => is.not_undefined(token)),
	)
};
