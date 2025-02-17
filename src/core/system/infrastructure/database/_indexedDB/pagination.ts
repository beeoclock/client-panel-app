import {environment} from "@environment/environment";
import {ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {HttpClient} from "@angular/common/http";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {delay, firstValueFrom} from "rxjs";
import {BaseItem, EventEmitter, LoadResponse} from "@signaldb/core";
import {IBaseEntity} from "@utility/domain";
import {pauseEmitter} from "./pause";

export const paginationEmitter = new EventEmitter();

const restoreTenantContext = () => {
	const raw = localStorage.getItem('tenantContext');
	const result = new Map();
	if (!raw) {
		return result;
	}
	const json = JSON.parse(raw as string);
	Object.entries(json).forEach(([tenant, collections]) => {
		const collectionMap = new Map();
		Object.entries(collections as never).forEach(([collection, params]) => {
			collectionMap.set(collection, params);
		});
		result.set(tenant, collectionMap);
	})
	return result;
}

/**
 * First string is tenant
 * Second string is collection
 * Value is object of params to recovery pagination process
 */
const tenantContext: Map<string, Map<string, {
	pages: number;
	currentPage: number;
	endpoint: {
		get: string;
	};
	updatedSince: string;
	orderDir: OrderDirEnum;
	orderBy: OrderByEnum;
}>> = restoreTenantContext();

const saveTenantContext = () => {
	const data = Object.fromEntries(tenantContext.entries());
	Object.keys(data).forEach((key) => {
		data[key] = Object.fromEntries(data[key].entries()) as unknown as never;
	});
	const json = JSON.stringify(data);
	localStorage.setItem('tenantContext', json);
};

export const paginationRegisterRemoteChange = (
	httpClient: HttpClient,
	tenantId: string,
	collectionOptions: {
		name: string;
		create: (data: unknown) => BaseItem;
		orderDir: OrderDirEnum;
		orderBy: OrderByEnum;
	},
	onChange: (data?: LoadResponse<BaseItem>) => Promise<void>
) => {

	console.log('[OK] paginationRegisterRemoteChange:initialized:', collectionOptions.name);

	const tryToRecoveryPaginationProcess = () => {
		const perCollectionContext = perTenantContext.get(collectionOptions.name);
		if (perCollectionContext) {
			if (perCollectionContext.pages > perCollectionContext.currentPage) {
				console.log('[OK] paginationRegisterRemoteChange:recovery:', collectionOptions.name);
				paginationEmitter.emit(collectionOptions.name, perCollectionContext);
			}
		}
	}

	/**
	 * Pause emitter
	 * Emitter is one but we will have instance for each collection per tenant, e.g. 4 collection adn two tenant, we will have 8 listeners
	 */
	let pauseIs = 'off';
	pauseEmitter.on(tenantId, async (state: 'on' | 'off') => {
		pauseIs = state;
		if (state === 'on') {
			console.log('[OK] paginationRegisterRemoteChange:pause:', collectionOptions.name);
		} else {
			console.log('[OK] paginationRegisterRemoteChange:resume:', collectionOptions.name);
			tryToRecoveryPaginationProcess();
		}
	});

	/**
	 * Prepare tenant context
	 */
	const perTenantContext = ((perTenantContext) => {
		if (!perTenantContext) {
			perTenantContext = new Map();
			tenantContext.set(tenantId, perTenantContext);
		}
		return perTenantContext;
	})(tenantContext.get(tenantId));

	/**
	 * Register remote change
	 */
	paginationEmitter.on(collectionOptions.name, async (data: {
		endpoint: {
			get: string
		},
		totalSize: number,
		updatedSince: string,
		orderDir: OrderDirEnum,
		orderBy: OrderByEnum,
	}) => {

		if (!data) {
			return;
		}

		/**
		 * Prepare collection context
		 */
		const perCollectionContext = ((perCollectionContext) => {
			if (!perCollectionContext) {

				const {endpoint, totalSize, updatedSince, orderBy, orderDir} = data;
				const pages = Math.ceil(totalSize / +environment.config.syncManager.pull.pageSize);

				perCollectionContext = {
					pages,
					endpoint,
					updatedSince,
					currentPage: 2,
					orderBy,
					orderDir,
				};
				perTenantContext.set(collectionOptions.name, perCollectionContext);
			}
			return perCollectionContext;
		})(perTenantContext.get(collectionOptions.name));

		/**
		 * Start pagination
		 */

		paginationEmitter.emit(`${collectionOptions.name}-start`, data);

		const {pages, currentPage, endpoint, updatedSince, orderDir, orderBy} = perCollectionContext;

		for (let page = currentPage; page <= pages; page++) {

			/**
			 * Pause pagination
			 */
			if (pauseIs === 'on') {
				break;
			}

			/**
			 * Pagination process
			 */
			perCollectionContext.currentPage = page;
			const request$ = httpClient.get<ResponseListType<IBaseEntity>>(endpoint.get, {
				params: {
					orderBy,
					orderDir,
					page,
					pageSize: environment.config.syncManager.pull.pageSize,
					updatedSince
				}
			}).pipe(delay(environment.config.syncManager.pull.delay));
			const response = await firstValueFrom(request$);
			await onChange({
				changes: {
					added: response.items.map(collectionOptions.create) as unknown as BaseItem[],
					modified: [],
					removed: []
				}
			});
			saveTenantContext();
		}

		/**
		 * Finish pagination
		 * Clear context
		 */
		if (perCollectionContext.pages === perCollectionContext.currentPage) {
			perTenantContext.delete(collectionOptions.name);
			saveTenantContext();
			console.log('[OK] paginationRegisterRemoteChange:finish:', collectionOptions.name);
		}

		paginationEmitter.emit(`${collectionOptions.name}-finish`, data);

	});

	/**
	 * Try to recover pagination process
	 */
	tryToRecoveryPaginationProcess();

};
