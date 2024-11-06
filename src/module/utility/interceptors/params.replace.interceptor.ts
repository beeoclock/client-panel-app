import {HttpInterceptorFn} from '@angular/common/http';
import {Endpoint} from "@utility/domain/endpoint";
import {environment} from "@environments/environment";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {REPLACE_MAP_REGEX} from "@utility/domain/const/c.regex";
import {IEndpointReplace} from "@utility/domain/interface/i.endpoint/i.endpoint-replace";
import {is} from "@utility/checker";
import {TokensHttpContext} from '@src/tokens.http-context';
import {NGXLogger} from 'ngx-logger';
import {inject} from "@angular/core";

/**
 *
 * @param request
 * @param next
 */
export const ParamsReplaceInterceptor: HttpInterceptorFn = (request, next) => {

	// Get path from headers, path was set at prepareLocalHeaders
	const path = request.context.get(TokensHttpContext.PATH);

	if (path) {

		const {replace} = Endpoint.endpointMap[request.method as RequestMethodEnum].get(path) ?? {};

		if (replace ?? environment?.endpoint?.config?.replace) {

			const replaceMap = request.context.get(TokensHttpContext.REPLACE);

			if (is.object_not_empty(replaceMap)) {

				const url: string = request.url;

				request = request.clone({
					url: replaceMatchItemInUrl(url, replaceMap),
				});

			} else {

				const ngxLogger = inject(NGXLogger);
				ngxLogger.error('replaceMap: ', replaceMap, 'path: ', path,);
				throw new Error('In your params: replace field is empty object. ' +
					'You can omit the step, for it just set boolean value "false" at replace flag in you endpoint declaration.');

			}

		}

	}

	return next(request);

}


/**
 *
 * @param path
 * @param replaceMap
 */
export const replaceMatchItemInUrl = (path: string, replaceMap: IEndpointReplace): string => {
  const keys = Object.keys(replaceMap);
  if (findNotMatchItems(path, replaceMap)) {
    return path.replace(REPLACE_MAP_REGEX, (m, key) => keys.includes(key) ? `${replaceMap[key]}` : '');
  }
  return '';
};


/**
 *
 * @param path
 * @param replaceMap
 * @private
 */
export const findNotMatchItems = (path: string, replaceMap: IEndpointReplace): boolean => {
  const match = path.match(REPLACE_MAP_REGEX);
  const replaceMapKeyList = Object.keys(replaceMap);
  if (match && match.length === replaceMapKeyList.length) {
    const notFoundKeyList = replaceMapKeyList.filter((replaceKey) => match.findIndex((key) => key.search(replaceKey) > -1) < 0);
    if (notFoundKeyList.length === 0) {
      return true;
    }
    throw new Error(`findNotMatchItems: Unknown items found (${notFoundKeyList.length}).`);
  }
  throw new Error('findNotMatchItems: Do not match.');
};
