import {HttpInterceptorFn} from "@angular/common/http";
import {EMPTY} from "rxjs";
import {injectNetwork} from "ngxtension/inject-network";

/**
 *
 * @param request
 * @param next
 */
export const InternetInterceptor: HttpInterceptorFn = (request, next) => {

	const network = injectNetwork();

	if (!network.online()) {
		// Cancel the request
		return EMPTY;
	}

	return next(request);

}
