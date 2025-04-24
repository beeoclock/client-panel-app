import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {GridResource} from "@tenant/plugin/tenant-plugin/presentation/ui/page/grid/grid.resource";
import ETenantPlugin from "@tenant/plugin/tenant-plugin/domain/entity/e.tenant-plugin";
import {CurrencyPipe} from "@angular/common";

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
			<h1 class="text-2xl font-bold text-gray-800 mb-4">Grid Plugin Page</h1>
			<p class="text-gray-600">This is a simple grid plugin page example.</p>
		</div>
		@if (resource(); as resource) {
			@for (storeItem of resource.items; track storeItem._id) {

				<div class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl max-w-xs">
					<img class="w-full h-auto rounded-t-xl aspect-video object-cover"
						 [src]="storeItem.plugin.logo.url"
						 alt="Card Image">
					<div class="p-4 md:p-5">
						@let languageVersion = storeItem.getLanguageVersionByCode(currentLanguage);
						@if (languageVersion) {
							<h3 class="text-lg font-bold text-gray-800">
								{{ languageVersion.title }}
							</h3>
							<p class="mt-1 text-gray-500">
								{{ languageVersion.description }}
							</p>
						}
						<div class="flex justify-between mt-2 items-center">
							<div>
								@if (storeItem.isFree()) {
									<span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-lg text-sm font-medium bg-green-100 text-green-800 dark:bg-white/10 dark:text-white">
										FREE
									</span>
								} @else {
									<span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white">
										{{ storeItem.plugin.price.amount | currency: storeItem.plugin.price.currency }}
									</span>
								}
							</div>
							@if (storeItem.tenantDoesNotHavePlugin()) {
								<button (click)="attach(storeItem)" class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
									{{ 'tenant-plugin.grid.plugin.attach' | translate }}
								</button>
							}
							@if (storeItem.isAttached()) {
								<button (click)="detach(storeItem)" class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-neutral-400 text-white hover:bg-neutral-500 focus:outline-hidden focus:bg-neutral-500 disabled:opacity-50 disabled:pointer-events-none">
									{{ 'tenant-plugin.grid.plugin.detach' | translate }}
								</button>
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

	public readonly currentLanguage = this.translateService.currentLang;

	public readonly resource = this.gridResource.merged;
	public readonly isLoading = this.gridResource.isLoading;

	public detach(storeItem: ETenantPlugin) {
		console.log({storeItem});
	}

	public attach(storeItem: ETenantPlugin) {
		console.log({storeItem});
	}
}

export default GridPluginPage;
