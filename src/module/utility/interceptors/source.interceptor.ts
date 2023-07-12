import {HttpInterceptorFn} from "@angular/common/http";
import {Endpoint} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {RuntimeEnvironment} from "@src/runtime.environment";

/**
 *
 * @param request
 * @param next
 */
export const SourceInterceptor: HttpInterceptorFn = (request, next) => {

  // Get path from headers, path was set at prepareLocalHeaders
  const path = request.headers.get('path');

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
