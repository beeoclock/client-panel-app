import {HttpInterceptorFn} from "@angular/common/http";
import {Endpoint} from "@shared/domain/endpoint";
import {RequestMethodEnum} from "@core/shared/enum/request-method.enum";
import {RuntimeEnvironment} from "@src/runtime.environment";
import {TokensHttpContext} from "@src/tokens.http-context";

/**
 *
 * @param request
 * @param next
 */
export const SourceInterceptor: HttpInterceptorFn = (request, next) => {

	// Get path from headers, path was set at prepareLocalHeaders
	const path = request.context.get(TokensHttpContext.PATH);

	if (path) {

		const {source} = Endpoint.endpointMap[request.method as RequestMethodEnum].get(path) ?? {};

		if (source) {

			const url = `${RuntimeEnvironment.apiUrls[source]}${request.url}`;

			request = request.clone({
				url
			});

		}

	}

	return next(request);

}
