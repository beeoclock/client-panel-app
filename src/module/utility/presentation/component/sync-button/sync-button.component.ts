import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from "@angular/core";
import {SyncManagerService} from "@src/database/tenant/signaldb/sync-manager.tenant.signaldb.database";
import {IsOnlineService} from "@utility/cdk/is-online.service";
import {AsyncPipe, DatePipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
	standalone: true,
	selector: 'sync-button-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		DatePipe,
		TranslatePipe
	],
	host: {
		class: 'px-3 pb-4 pt-0'
	},
	template: `

		@if (isOffline$ | async) {

			<div class="rounded-2xl border border-red-300 bg-red-100 flex flex-col">
				<button (click)="syncAll()"
						class="h-[48px] text-red-700 gap-2 p-2 px-3 rounded-2xl flex justify-start items-center hover:bg-red-200 cursor-pointer transition-all">
					<i class="bi bi-arrow-repeat text-xl"></i>
					<div class="flex flex-col items-start">
						<span class="text-xs">
							{{ 'keyword.capitalize.youOffline' | translate }}
						</span>
						<span class="text-xs">
							{{ syncManagerService.lastSynchronizedIn | date: 'dd.MM.yyyy HH:mm:ss' }}
						</span>
					</div>
				</button>
			</div>

		} @else {

			<div class="rounded-2xl border border-neutral-300 bg-neutral-50 flex flex-col">
				@if (isSyncing$ | async) {

					<div
						class="h-[48px] w-full gap-2 text-black p-2 px-3 rounded-2xl flex justify-start items-center">
						<i class="animate-spin bi bi-arrow-repeat text-xl"></i>
						<span class="text-xs">
								{{ 'keyword.capitalize.syncing' | translate }}
							</span>
					</div>

				} @else {

					<button (click)="syncAll()"
							class="h-[48px] text-black gap-2 p-2 px-3 rounded-2xl flex justify-start items-center hover:bg-neutral-200 cursor-pointer transition-all">
						<i class="bi bi-arrow-repeat text-xl"></i>
						<div class="flex flex-col items-start">
							<span class="text-xs">
								{{ 'keyword.capitalize.synced' | translate }}:
							</span>
							<span class="text-xs">
								{{ syncManagerService.lastSynchronizedIn | date: 'dd.MM.yyyy HH:mm:ss' }}
							</span>
						</div>
					</button>

				}
			</div>

		}

	`
})
export class SyncButtonComponent {

	private readonly isOnlineService = inject(IsOnlineService);
	protected readonly syncManagerService = inject(SyncManagerService);

	public readonly isOffline$ = this.isOnlineService.isOffline$;
	public readonly isSyncing$ = this.syncManagerService.isSyncing$;

	public syncAll() {
		this.syncManagerService.syncAll().then();
	}

}
