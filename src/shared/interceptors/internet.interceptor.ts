import {HttpInterceptorFn} from "@angular/common/http";
import {inject} from "@angular/core";
import {IsOnlineService} from "@core/cdk/is-online.service";
import {EMPTY} from "rxjs";

/**
 *
 * @param request
 * @param next
 */
export const InternetInterceptor: HttpInterceptorFn = (request, next) => {

	const isOnlineService = inject(IsOnlineService);

	if (isOnlineService.isOffline()) {
		// Cancel the request
		return EMPTY;
	}

	return next(request);

}
