import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {filter, switchMap, take} from "rxjs";
import {inject} from "@angular/core";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {Endpoint} from "@utility/domain/endpoint";
import {is} from "@utility/checker";
import {TokensHttpContext} from "@src/tokens.http-context";
import {TENANT_ID} from "@src/token";

/**
 * Set Authorization header to every request that has at config header.authorization = true
 *
 * @param request
 * @param next
 */
export const TenantIdInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
// Get path from headers, path was set at prepareLocalHeaders
    const path = request.context.get(TokensHttpContext.PATH)

    if (path) {
        const {header} = Endpoint.endpointMap[request.method as RequestMethodEnum].get(path) ?? {};

        if (header?.tenantId) {

            const tenantId$ = inject(TENANT_ID);

            return tenantId$.pipe(
                filter(is.string_not_empty<string>),
                take(1),
                switchMap(tenantId => {
                    const headers = request.headers.set('x-business-tenant-id', tenantId);
                    return next(request.clone({
                            headers
                        })
                    );
                })
            );

        }

    }

    return next(request);

}

