import {ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {GridResource} from "@tenant/plugin/tenant-plugin/presentation/ui/page/grid/grid.resource";
import ETenantPlugin from "@tenant/plugin/tenant-plugin/domain/entity/e.tenant-plugin";
import {CurrencyPipe} from "@angular/common";
import {injectNetwork} from "ngxtension/inject-network";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	TenantPluginDataActions
} from "@tenant/plugin/tenant-plugin/infrastructure/state/data/tenant-plugin.data.actions";
import {Actions, ofActionErrored, ofActionSuccessful} from "@ngxs/store";
import {tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {ExecuteFunctionApi} from "@tenant/plugin/tenant-plugin/infrastructure/data-source/api/execute-function.api";
import {NGXLogger} from "ngx-logger";

@Component({
	selector: 'app-list-tenant-plugin-page',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		CurrencyPipe,
	],
	standalone: true,
	providers: [
		GridResource
	],
	host: {
		class: 'p-4 flex flex-wrap gap-4'
	},
	template: `
		<div class="w-full">
			<h1 class="text-2xl font-bold text-gray-800 mb-4">{{ 'keyword.capitalize.plugins' | translate }}</h1>
			<p class="text-gray-600">{{ 'tenant-plugin.grid.subtitle' | translate }}</p>
		</div>
		@if (resource(); as resource) {
			@for (storeItem of resource.items; track storeItem._id) {

				<div class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl max-w-xs">
					<img class="w-full h-auto rounded-t-xl aspect-video object-cover"
						 [src]="storeItem.plugin.logo.url"
						 alt="Card Image">
					<div class="flex flex-1 flex-col justify-between md:p-5 p-4">
						<div>
							@let languageVersion = storeItem.getLanguageVersionByCode(currentLanguage) ;
							@if (languageVersion) {
								<h3 class="text-lg font-bold text-gray-800">
									{{ languageVersion.title }}
								</h3>
								<p class="mt-1 text-gray-500">
									{{ languageVersion.description }}
								</p>
							}
						</div>
						<div class="flex justify-between mt-2 items-center">
							<div>
								@if (storeItem.isFree()) {
									<span
										class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-lg text-sm font-medium bg-green-100 text-green-800 dark:bg-white/10 dark:text-white">
										FREE
									</span>
								} @else {
									@if (storeItem.isPriceTypeTariffPlan()) {
										<span
											class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white">
											{{ storeItem.plugin.price.amount | currency: storeItem.plugin.price.currency }}
										</span>
									}
									@if (storeItem.isPriceTypePayAsYouGo()) {
										<span
											class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white">
											{{ 'keyword.capitalize.payAsYouGo' | translate }}
										</span>
									}
								}
							</div>
							@if (isOnline()) {
								@if (storeItem.isUpcoming()) {
									<div class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-neutral-200 text-neutral-500">
										{{ 'keyword.capitalize.isUpcoming' | translate }}
									</div>
								} @else {
									@if (storeItem.tenantDoesNotHavePlugin() || storeItem.isDetached()) {
										<button (click)="attach(storeItem)"
												[disabled]="loadingRecordByPluginId()[storeItem._id]"
												class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white transition-all hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
											@if (loadingRecordByPluginId()[storeItem._id]) {
												<i class="bi bi-arrow-clockwise animate-spin"></i>
											} @else {
												{{ 'tenant-plugin.grid.plugin.attach' | translate }}
											}
										</button>
									}
									@if (storeItem.isAttached()) {
										<button (click)="openDetailsOf(storeItem)" class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent text-neutral-500 hover:bg-neutral-400 hover:text-white transition-all focus:outline-hidden focus:bg-neutral-500 focus:text-white disabled:opacity-50 disabled:pointer-events-none">
											<i class="bi bi-eye"></i>
											{{ 'keyword.capitalize.details' | translate }}
										</button>
									}
									@if (storeItem.isOnboardingPending()) {
										<button (click)="continueOnboarding(storeItem)" [disabled]="loadingRecordByPluginId()[storeItem._id]" class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white transition-all hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
											@if (loadingRecordByPluginId()[storeItem._id]) {
												<i class="bi bi-arrow-clockwise animate-spin"></i>
											} @else {
												{{ 'keyword.capitalize.completeTheProcess' | translate }}
												<i class="bi bi-arrow-right"></i>
											}
										</button>
									}
								}
							} @else {
								<div
									class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-neutral-200 text-neutral-500">
									<i class="bi bi-wifi-off"></i>
								</div>
							}
						</div>
					</div>
				</div>
			}
		}

		@if (isLoading()) {

			<div class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl max-w-xs">
				<div class="rounded-t-xl aspect-video object-cover h-[178px] w-[318px] bg-neutral-200"></div>
				<div class="flex flex-col h-full justify-between md:p-5 p-4 min-h-[166px]">
					<div class="flex flex-col gap-2">
						<h3 class="text-lg font-bold text-gray-800">
							<div class="w-[60px] h-6 rounded-2xl animate-pulse bg-neutral-300"></div>
						</h3>
						<div class="mt-1 text-gray-500">
							<div class="w-[120px] h-4 rounded-2xl animate-pulse bg-neutral-300"></div>
						</div>
					</div>

					<div class="w-[120px] h-8 rounded-2xl animate-pulse bg-neutral-300"></div>
				</div>
			</div>
		}
	`
})
export class GridPluginPage {

	private readonly translateService = inject(TranslateService);
	private readonly gridResource = inject(GridResource);
	private readonly actions = inject(Actions);
	private readonly router = inject(Router);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly executeFunctionApi = inject(ExecuteFunctionApi);
	private readonly network = injectNetwork();

	public readonly currentLanguage = this.translateService.currentLang;

	public readonly isOnline = this.network.online;

	public readonly resource = this.gridResource.merged;
	public readonly isLoading = this.gridResource.isLoading;

	public readonly loadingRecordByPluginId = signal<{[key: string]: boolean}>({});

	private readonly successfulActionsSubscription = this.actions.pipe(
		ofActionSuccessful(
			TenantPluginDataActions.Attach,
			TenantPluginDataActions.Detach,
		),
		tap((action) => {
			setTimeout(() => {
				this.setLoadingState(action.payload, false);
				this.gridResource.reload();
			}, 500);
		})
	).subscribe();

	private readonly erroredActionsSubscription = this.actions.pipe(
		ofActionErrored(
			TenantPluginDataActions.Attach,
			TenantPluginDataActions.Detach,
		),
		tap(({action}) => {
			this.setLoadingState(action.payload, false);
		})
	).subscribe();

	public attach(storeItem: ETenantPlugin) {
		this.setLoadingState(storeItem, true);
		this.attachPlugin(storeItem);
	}

	public continueOnboarding(storeItem: ETenantPlugin) {
		this.setLoadingState(storeItem, true);
		this.executeFunctionApi.executeAsync({}, storeItem.plugin.slug, 'getOnboardingUrl').then((response) => {
			this.setLoadingState(storeItem, false);
			this.ngxLogger.debug('Get onboarding URL response', response);
			const {url} = response as {url?: string};
			if (url?.length) window.open(url, '_blank');
		})
	}

	private setLoadingState(storeItem: ETenantPlugin, isLoading: boolean) {
		this.loadingRecordByPluginId.update((prev) => ({
			...prev,
			[storeItem._id]: isLoading
		}));
	}

	@Dispatch()
	private attachPlugin(plugin: ETenantPlugin) {
		return new TenantPluginDataActions.Attach(plugin);
	}

	protected readonly structuredClone = structuredClone;

	public openDetailsOf(storeItem: ETenantPlugin) {
		return this.router.navigate([{outlets: {second: ['plugin', storeItem._id]}}]);
	}
}

export default GridPluginPage;
